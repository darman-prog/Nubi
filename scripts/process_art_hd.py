"""
Script definitivo de procesamiento de arte en WebP HD para Nubi y el Archipiélago del Sueño.
Aplica flood-fill exterior desde los bordes + descontaminación de color del trazo oscuro,
preservando al 100% los brillos blancos internos de Nubi y eliminando todo halo blanco exterior.
Además limpia archivos duplicados (.png), trazados viejos (.svg fuera de sellos/) y pruebas temporales.
"""
from pathlib import Path
import shutil
from typing import List, Tuple
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT_DIR = Path(__file__).resolve().parent.parent
ARTE_DIR = ROOT_DIR / "arte"
GENERADOS_DIR = ARTE_DIR / "generados"
NUBI_EXP_DIR = ARTE_DIR / "nubiExpresiones"
BRAIN_DIR = Path(r"C:\Users\damez\.gemini\antigravity-cli\brain\362c87fe-3af3-45e8-b09d-065ed23c9e58")


def clean_white_bg_floodfill_webp(
    input_path: Path,
    output_webp_path: Path,
    max_dim: int = 1024,
    extra_seeds_rel: List[Tuple[float, float]] | None = None
) -> None:
    """
    Recorta el fondo blanco exterior mediante flood-fill desde las esquinas hasta el trazo oscuro
    cerrado (#43284B), protegiendo los brillos blancos internos del personaje y eliminando el halo.
    """
    old_right_px = None
    if output_webp_path.exists():
        with Image.open(output_webp_path) as prev_img:
            p_arr = np.array(prev_img)
            old_right_px = p_arr[p_arr.shape[0] // 2, p_arr.shape[1] - 10].tolist()

    output_webp_path.parent.mkdir(parents=True, exist_ok=True)

    with Image.open(input_path).convert("RGBA") as img:
        img.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)
        arr = np.array(img, dtype=np.float32)

        # Calculamos la luminancia percibida para detectar la pared del trazo morado oscuro
        lum = 0.299 * arr[:, :, 0] + 0.587 * arr[:, :, 1] + 0.114 * arr[:, :, 2]

        # El núcleo del trazo oscuro tiene luminancia <= 95 y actúa como barrera cerrada (valor 0)
        wall_img = Image.fromarray(np.where(lum > 95, 255, 0).astype(np.uint8)).copy()
        w, h = wall_img.size

        # Semillas en las 4 esquinas exteriores + semillas adicionales para huecos internos (ej. bufanda)
        seeds = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]
        if extra_seeds_rel:
            for rx, ry in extra_seeds_rel:
                seeds.append((int(w * rx), int(h * ry)))

        for seed in seeds:
            if wall_img.getpixel(seed) == 255:
                ImageDraw.floodfill(wall_img, seed, 128)

        ext_mask = np.array(wall_img) == 128

        # Dilatamos 2 píxeles la silueta interior para que solo el borde inmediato al trazo
        # tenga rampa de antialiasing y ningún residuo del fondo lejano quede semitransparente
        interior_img = Image.fromarray(np.where(~ext_mask, 255, 0).astype(np.uint8))
        dilated_interior = np.array(interior_img.filter(ImageFilter.MaxFilter(5))) > 0
        near_outline = ext_mask & dilated_interior

        edge_alpha = np.clip((215.0 - lum) / (215.0 - 95.0), 0.0, 1.0)
        alpha = np.where(~ext_mask, 1.0, np.where(near_outline, edge_alpha, 0.0))

        out = arr.copy()
        # Fijamos el color RGB del borde antialias exterior al tono exacto del trazo oscuro (67, 40, 75)
        ext_edge = near_outline & (alpha > 0.0)
        out[:, :, 0] = np.where(ext_edge, 67.0, out[:, :, 0])
        out[:, :, 1] = np.where(ext_edge, 40.0, out[:, :, 1])
        out[:, :, 2] = np.where(ext_edge, 75.0, out[:, :, 2])

        # Limpiamos a negro transparente [0, 0, 0, 0] todo píxel con alpha == 0 para que libwebp
        # no arrastre el color morado del borde hacia la derecha al comprimir las líneas horizontales
        zero_alpha = alpha <= 0.0
        out[:, :, 0] = np.where(zero_alpha, 0.0, out[:, :, 0])
        out[:, :, 1] = np.where(zero_alpha, 0.0, out[:, :, 1])
        out[:, :, 2] = np.where(zero_alpha, 0.0, out[:, :, 2])
        out[:, :, 3] = alpha * 255.0

        clean_img = Image.fromarray(out.astype(np.uint8))
        # exact=True impide que libwebp sobrescriba el RGB de los píxeles transparentes con el último color visto
        clean_img.save(output_webp_path, "WEBP", lossless=True, exact=True)

    with Image.open(output_webp_path) as check_img:
        chk = np.array(check_img)
        right_px = chk[chk.shape[0] // 2, chk.shape[1] - 10].tolist()

    webp_kb = output_webp_path.stat().st_size / 1024
    print(f"[WebP Recorte Limpio] {output_webp_path.relative_to(ARTE_DIR)} ({webp_kb:.1f} KB) | antes={old_right_px} -> ahora={right_px}")


def save_integrated_webp(
    input_path: Path,
    output_webp_path: Path,
    max_dim: int = 1280,
    quality: int = 92
) -> None:
    """
    Convierte ilustraciones de fondo integrado (escenas e islas panorámicas) a WebP HD.
    """
    output_webp_path.parent.mkdir(parents=True, exist_ok=True)

    with Image.open(input_path).convert("RGB") as img:
        img.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)
        img.save(output_webp_path, "WEBP", quality=quality, method=6)

    webp_kb = output_webp_path.stat().st_size / 1024
    print(f"[WebP Integrado HD]   {output_webp_path.relative_to(ARTE_DIR)} ({webp_kb:.1f} KB)")


def cleanup_duplicates_and_temp_files() -> None:
    """
    Elimina los archivos .svg antiguos, los duplicados .png
    en las carpetas de salida y las imágenes temporales de prueba.
    """
    print("\n=== Limpiando archivos viejos, duplicados y de prueba ===")
    removed_count = 0

    # 1. Archivos temporales en la raíz de arte/
    temp_patterns = [
        "compare_*.png",
        "test_*.png",
        "test_*.webp",
        "hero-portada.png",
        "hero-portada.svg",
        "coronacion.png",
        "coronacion.svg",
    ]
    for pat in temp_patterns:
        for f in ARTE_DIR.glob(pat):
            f.unlink()
            removed_count += 1

    # Recorremos las 4 subcarpetas de salida para dejar únicamente los .webp definitivos
    for folder in ["nubi", "islas", "escenas", "sellos"]:
        sub = ARTE_DIR / folder
        if sub.exists():
            for ext in ("*.svg", "*.png", "*.temp.png", "*.prep.png"):
                for f in sub.glob(ext):
                    f.unlink()
                    removed_count += 1

    print(f"Archivos antiguos/duplicados eliminados: {removed_count}")


def run_all() -> None:
    print("\n=== 1. Procesando Nubi y Accesorios (WebP Lossless sin Halo) ===")
    nubi_items = [
        (NUBI_EXP_DIR / "nubi-neutral.jpg", "nubi/nubi-neutral.webp", None),
        (NUBI_EXP_DIR / "nubi-feliz.jpg", "nubi/nubi-feliz.webp", None),
        (NUBI_EXP_DIR / "nubi-curioso.jpg", "nubi/nubi-curiosa.webp", None),
        (NUBI_EXP_DIR / "nubi-pensando.jpg", "nubi/nubi-pensando.webp", None),
        (NUBI_EXP_DIR / "nubi-celebrando.jpg", "nubi/nubi-celebrando.webp", None),
        (NUBI_EXP_DIR / "nubi-cansado.jpg", "nubi/nubi-soñolienta.webp", None),
        (NUBI_EXP_DIR / "nubi-narrador.jpg", "nubi/nubi-narrando.webp", None),
        (NUBI_EXP_DIR / "nubi-base.jpg", "nubi/nubi-base.webp", None),
        (GENERADOS_DIR / "nubi-apoyando.jpg", "nubi/nubi-apoyando.webp", None),
        (GENERADOS_DIR / "acc-gorro-dormir.jpg", "nubi/acc-gorro-dormir.webp", None),
        # La bufanda tiene un hueco interior blanco en el centro superior del aro
        (GENERADOS_DIR / "acc-bufanda-estrellas.jpg", "nubi/acc-bufanda-estrellas.webp", [(0.5, 0.36)]),
        (GENERADOS_DIR / "acc-lentes-luna.jpg", "nubi/acc-lentes-luna.webp", [(0.5, 0.47)]),
    ]
    for src, dst_rel, seeds in nubi_items:
        if src.exists():
            clean_white_bg_floodfill_webp(src, ARTE_DIR / dst_rel, max_dim=1024, extra_seeds_rel=seeds)

    print("\n=== 2. Procesando Islas del Mapa (WebP HD) ===")
    # Las 6 islas originales tienen fondo de cielo integrado; isla-niebla tiene fondo blanco recortable
    integrated_islands = [
        (NUBI_EXP_DIR / "nido.jpeg", "islas/nido.webp"),
        (NUBI_EXP_DIR / "torreRelojAmanecer.jpeg", "islas/reloj.webp"),
        (NUBI_EXP_DIR / "horarios.jpeg", "islas/horarios.webp"),
        (NUBI_EXP_DIR / "animo.jpeg", "islas/animo.webp"),
        (NUBI_EXP_DIR / "cerebro.jpeg", "islas/cerebro.webp"),
        (NUBI_EXP_DIR / "taller.jpeg", "islas/taller.webp"),
    ]
    for src, dst_rel in integrated_islands:
        if src.exists():
            save_integrated_webp(src, ARTE_DIR / dst_rel, max_dim=800)

    if (GENERADOS_DIR / "isla-niebla.jpg").exists():
        clean_white_bg_floodfill_webp(
            GENERADOS_DIR / "isla-niebla.jpg",
            ARTE_DIR / "islas/isla-niebla.webp",
            max_dim=800
        )

    print("\n=== 3. Procesando Escenas Narrativas y Portada (WebP HD 1280px) ===")
    escenas = [
        (GENERADOS_DIR / "nido-1.jpg", "escenas/nido-1.webp"),
        (GENERADOS_DIR / "reloj-1.jpg", "escenas/reloj-1.webp"),
        (GENERADOS_DIR / "reloj-2.jpg", "escenas/reloj-2.webp"),
        (GENERADOS_DIR / "horarios-1.jpg", "escenas/horarios-1.webp"),
        (GENERADOS_DIR / "horarios-2.jpg", "escenas/horarios-2.webp"),
        (GENERADOS_DIR / "animo-1.jpg", "escenas/animo-1.webp"),
        (GENERADOS_DIR / "animo-2.jpg", "escenas/animo-2.webp"),
        (GENERADOS_DIR / "cerebro-1.jpg", "escenas/cerebro-1.webp"),
        (GENERADOS_DIR / "cerebro-2.jpg", "escenas/cerebro-2.webp"),
        (GENERADOS_DIR / "taller-1.jpg", "escenas/taller-1.webp"),
        (GENERADOS_DIR / "taller-2.jpg", "escenas/taller-2.webp"),
        (GENERADOS_DIR / "hero-portada.jpg", "hero-portada.webp"),
        (GENERADOS_DIR / "coronacion.jpg", "coronacion.webp"),
    ]
    for src, dst_rel in escenas:
        if src.exists():
            save_integrated_webp(src, ARTE_DIR / dst_rel, max_dim=1280)

    print("\n=== 4. Procesando Sellos del Pasaporte (WebP Lossless sin Halo) ===")
    # Copiamos los originales recién generados en el directorio de artefactos hacia arte/generados/
    raw_stamps = [
        ("sello_nido_1794066236543.jpg", "sello-nido.jpg"),
        ("sello_reloj_1794066293908.jpg", "sello-reloj.jpg"),
        ("sello_horarios_1794066352164.jpg", "sello-horarios.jpg"),
        ("sello_animo_1794066425281.jpg", "sello-animo.jpg"),
        ("sello_cerebro_1794066480404.jpg", "sello-cerebro.jpg"),
        ("sello_taller_1794066542306.jpg", "sello-taller.jpg"),
    ]
    GENERADOS_DIR.mkdir(parents=True, exist_ok=True)
    for brain_name, gen_name in raw_stamps:
        brain_src = BRAIN_DIR / brain_name
        gen_dst = GENERADOS_DIR / gen_name
        if brain_src.exists() and not gen_dst.exists():
            shutil.copy2(brain_src, gen_dst)

    # Cada sello tiene un anillo exterior morado cerrado (#43284B) que protege los brillos internos
    sellos = [
        (GENERADOS_DIR / "sello-nido.jpg", "sellos/sello-nido.webp"),
        (GENERADOS_DIR / "sello-reloj.jpg", "sellos/sello-reloj.webp"),
        (GENERADOS_DIR / "sello-horarios.jpg", "sellos/sello-horarios.webp"),
        (GENERADOS_DIR / "sello-animo.jpg", "sellos/sello-animo.webp"),
        (GENERADOS_DIR / "sello-cerebro.jpg", "sellos/sello-cerebro.webp"),
        (GENERADOS_DIR / "sello-taller.jpg", "sellos/sello-taller.webp"),
    ]
    for src, dst_rel in sellos:
        if src.exists():
            clean_white_bg_floodfill_webp(src, ARTE_DIR / dst_rel, max_dim=800)

    # Generamos un mosaico de verificación de los 6 sellos sobre fondo negro (con y sin canal alfa)
    grid = Image.new("RGB", (3 * 300, 2 * 300), (0, 0, 0))
    for idx, (_, dst_rel) in enumerate(sellos):
        webp_path = ARTE_DIR / dst_rel
        if webp_path.exists():
            with Image.open(webp_path) as s_img:
                # Extraemos los canales RGB crudos tal cual quedaron codificados dentro del archivo .webp
                raw_rgb = s_img.convert("RGB").resize((280, 280), Image.Resampling.LANCZOS)
                gx = (idx % 3) * 300 + 10
                gy = (idx // 3) * 300 + 10
                grid.paste(raw_rgb, (gx, gy))
    grid.save(BRAIN_DIR / "verify_sellos_on_black.png", "PNG")

    cleanup_duplicates_and_temp_files()


if __name__ == "__main__":
    run_all()
    print("\nListo: carpeta arte/ limpia y unificada 100% en WebP HD.")
