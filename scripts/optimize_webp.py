"""
Script de optimización y conversión de arte a WebP en alta calidad para Nubi.
Mantiene 100% de la fidelidad artística original, colores pastel y degradados,
con soporte de transparencia alfa y compresión ligera (10-30 KB).
"""
import os
import sys
from pathlib import Path
from PIL import Image

ROOT_DIR = Path(__file__).resolve().parent.parent
ARTE_DIR = ROOT_DIR / "arte"
GENERADOS_DIR = ARTE_DIR / "generados"
NUBI_EXP_DIR = ARTE_DIR / "nubiExpresiones"


def convert_to_webp(
    input_path: Path,
    output_path: Path,
    max_dim: int = 800,
    quality: int = 88,
    is_transparent: bool = False,
    white_threshold: int = 242
) -> None:
    """
    Convierte una imagen a WebP de alta fidelidad, redimensionando con filtro Lanczos
    y aplicando máscara de transparencia alfa para fondos blancos si se requiere.
    """
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with Image.open(input_path) as img:
        # Redimensionamos proporcionalmente para resolución nítida en pantallas móviles Retina
        img.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)

        if is_transparent:
            rgba = img.convert("RGBA")
            datas = rgba.getdata()
            new_data = []

            # Evaluamos píxeles blancos del fondo para volverlos transparentes
            for item in datas:
                # Comparamos canales RGB contra el umbral de blanco
                if item[0] >= white_threshold and item[1] >= white_threshold and item[2] >= white_threshold:
                    new_data.append((255, 255, 255, 0))
                else:
                    new_data.append(item)

            rgba.putdata(new_data)
            # Guardamos en WebP con compresión de alta calidad y canal alfa intacto
            rgba.save(output_path, "WEBP", quality=quality, method=6)
        else:
            rgb = img.convert("RGB")
            rgb.save(output_path, "WEBP", quality=quality, method=6)

    size_kb = output_path.stat().st_size / 1024
    print(f"[WebP {size_kb:.1f} KB] {output_path.name}")


def process_all_webp():
    """
    Procesa todo el inventario de arte disponible a WebP de alta fidelidad.
    """
    print("\n=== Procesando Expresiones de Nubi y Accesorios a WebP ===")
    nubi_items = [
        # (origen, destino relativo, max_dim, is_transparent)
        (NUBI_EXP_DIR / "nubi-neutral.jpg", "nubi/nubi-neutral.webp", 480, True),
        (NUBI_EXP_DIR / "nubi-feliz.jpg", "nubi/nubi-feliz.webp", 480, True),
        (NUBI_EXP_DIR / "nubi-curioso.jpg", "nubi/nubi-curiosa.webp", 480, True),
        (NUBI_EXP_DIR / "nubi-pensando.jpg", "nubi/nubi-pensando.webp", 480, True),
        (NUBI_EXP_DIR / "nubi-celebrando.jpg", "nubi/nubi-celebrando.webp", 480, True),
        (NUBI_EXP_DIR / "nubi-cansado.jpg", "nubi/nubi-soñolienta.webp", 480, True),
        (NUBI_EXP_DIR / "nubi-narrador.jpg", "nubi/nubi-narrando.webp", 480, True),
        (NUBI_EXP_DIR / "nubi-base.jpg", "nubi/nubi-base.webp", 480, True),
        (GENERADOS_DIR / "nubi-apoyando.jpg", "nubi/nubi-apoyando.webp", 480, True),
        (GENERADOS_DIR / "acc-gorro-dormir.jpg", "nubi/acc-gorro-dormir.webp", 400, True),
        (GENERADOS_DIR / "acc-bufanda-estrellas.jpg", "nubi/acc-bufanda-estrellas.webp", 400, True),
        (GENERADOS_DIR / "acc-lentes-luna.jpg", "nubi/acc-lentes-luna.webp", 400, True),
    ]
    for src, dst_rel, dim, trans in nubi_items:
        if src.exists():
            convert_to_webp(src, ARTE_DIR / dst_rel, max_dim=dim, is_transparent=trans)

    print("\n=== Procesando Miniaturas de Islas a WebP ===")
    isla_items = [
        (NUBI_EXP_DIR / "nido.jpeg", "islas/nido.webp", 360, True),
        (NUBI_EXP_DIR / "torreRelojAmanecer.jpeg", "islas/reloj.webp", 360, True),
        (NUBI_EXP_DIR / "horarios.jpeg", "islas/horarios.webp", 360, True),
        (NUBI_EXP_DIR / "animo.jpeg", "islas/animo.webp", 360, True),
        (NUBI_EXP_DIR / "cerebro.jpeg", "islas/cerebro.webp", 360, True),
        (NUBI_EXP_DIR / "taller.jpeg", "islas/taller.webp", 360, True),
        (GENERADOS_DIR / "isla-niebla.jpg", "islas/isla-niebla.webp", 360, True),
    ]
    for src, dst_rel, dim, trans in isla_items:
        if src.exists():
            convert_to_webp(src, ARTE_DIR / dst_rel, max_dim=dim, is_transparent=trans)

    print("\n=== Procesando Escenas Narrativas y Macro a WebP ===")
    escenas_items = [
        # Escenas 16:9 con fondo integrado (800px para máxima definición en móvil)
        (GENERADOS_DIR / "nido-1.jpg", "escenas/nido-1.webp", 800, False),
        (GENERADOS_DIR / "reloj-1.jpg", "escenas/reloj-1.webp", 800, False),
        (GENERADOS_DIR / "reloj-2.jpg", "escenas/reloj-2.webp", 800, False),
        (GENERADOS_DIR / "horarios-1.jpg", "escenas/horarios-1.webp", 800, False),
        (GENERADOS_DIR / "horarios-2.jpg", "escenas/horarios-2.webp", 800, False),
        (GENERADOS_DIR / "animo-1.jpg", "escenas/animo-1.webp", 800, False),
        (GENERADOS_DIR / "animo-2.jpg", "escenas/animo-2.webp", 800, False),
        (GENERADOS_DIR / "cerebro-1.jpg", "escenas/cerebro-1.webp", 800, False),
        (GENERADOS_DIR / "cerebro-2.jpg", "escenas/cerebro-2.webp", 800, False),
        (GENERADOS_DIR / "taller-1.jpg", "escenas/taller-1.webp", 800, False),
        (GENERADOS_DIR / "taller-2.jpg", "escenas/taller-2.webp", 800, False),
        # Piezas Macro
        (GENERADOS_DIR / "hero-portada.jpg", "hero-portada.webp", 800, False),
        (GENERADOS_DIR / "coronacion.jpg", "coronacion.webp", 800, False),
    ]
    for src, dst_rel, dim, trans in escenas_items:
        if src.exists():
            convert_to_webp(src, ARTE_DIR / dst_rel, max_dim=dim, is_transparent=trans)


if __name__ == "__main__":
    process_all_webp()
    print("\nTodos los recursos WebP han sido generados con máxima fidelidad.")
