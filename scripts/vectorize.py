"""
Script de vectorización y optimización de arte para Nubi y el Archipiélago del Sueño.
Convierte imágenes ráster a SVG vectorial limpio (<= 20 KB) con recorte de fondo alfa,
redimensionado inteligente para reducir nodos, trazado spline con vtracer y optimización con SVGO.
"""
import os
import sys
import subprocess
from pathlib import Path
from PIL import Image
import vtracer

# Directorio raíz del proyecto
ROOT_DIR = Path(__file__).resolve().parent.parent
ARTE_DIR = ROOT_DIR / "arte"
GENERADOS_DIR = ARTE_DIR / "generados"


def process_and_prepare_image(
    input_path: Path,
    temp_path: Path,
    max_dim: int = 384,
    is_transparent: bool = False,
    white_threshold: int = 240
) -> Path:
    """
    Redimensiona la imagen y opcionalmente recorta el fondo blanco a transparencia.
    Redimensionar a 384px es clave para que vtracer genere curvas suaves sin miles de nodos,
    garantizando que el SVG final quede por debajo del presupuesto de 20 KB.
    """
    with Image.open(input_path) as img:
        # Calculamos la proporción manteniendo el aspect ratio
        img.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)

        if is_transparent:
            rgba = img.convert("RGBA")
            datas = rgba.getdata()
            new_data = []

            # Evaluamos píxeles blancos del fondo para volverlos transparentes
            for item in datas:
                if item[0] >= white_threshold and item[1] >= white_threshold and item[2] >= white_threshold:
                    new_data.append((255, 255, 255, 0))
                else:
                    new_data.append(item)

            rgba.putdata(new_data)
            rgba.save(temp_path, "PNG")
        else:
            img.convert("RGB").save(temp_path, "PNG")

    return temp_path


def vectorize_image(
    input_path: Path,
    output_path: Path,
    max_dim: int = 384,
    is_transparent: bool = False
) -> bool:
    """
    Vectoriza una imagen ráster a SVG usando vtracer y optimiza con SVGO.
    """
    output_path.parent.mkdir(parents=True, exist_ok=True)
    temp_png = output_path.with_suffix(".prep.png")

    try:
        # Preparamos la imagen (redimensionado + alfa si aplica)
        process_and_prepare_image(input_path, temp_png, max_dim=max_dim, is_transparent=is_transparent)

        # Opciones de trazado vectorial optimizado para estilo onírico plano y ultra ligero
        vtracer.convert_image_to_svg_py(
            str(temp_png),
            str(output_path),
            colormode="color",
            hierarchical="stacked",
            mode="spline",
            filter_speckle=24 if max_dim <= 256 else 32, # Filtra ruido agresivamente
            color_precision=3 if max_dim > 256 else 4,   # 8-12 tonos pastel planos
            layer_difference=24,                         # Suaviza transiciones de color
            corner_threshold=90,                         # Curvas fluidas y redondeadas
            length_threshold=5.0,
            max_iterations=10,
            splice_threshold=50,
            path_precision=1                             # 1 decimal para coordenadas compactas
        )

        # Eliminamos el archivo temporal
        if temp_png.exists():
            temp_png.unlink()

        # Optimizamos el SVG resultante con svgo
        subprocess.run(
            ["npx", "--yes", "svgo", str(output_path), "-o", str(output_path), "--multipass", "--precision", "1"],
            check=True,
            shell=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )

        size_kb = output_path.stat().st_size / 1024
        status = "OK" if size_kb <= 20 else "ADVERTENCIA: >20KB"
        print(f"[{status}] {output_path.name} -> {size_kb:.1f} KB")
        return True

    except Exception as e:
        print(f"[ERROR] Al vectorizar {input_path.name}: {e}")
        if temp_png.exists():
            temp_png.unlink()
        return False


def generate_stamp_svg(island_slug: str, title: str, glyph_path: str, output_path: Path):
    """
    Genera un sello circular dorado estilo pasaporte de viaje completamente vectorial.
    """
    output_path.parent.mkdir(parents=True, exist_ok=True)
    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <radialGradient id="gold-grad-{island_slug}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFF5D6"/>
      <stop offset="60%" stop-color="#F3DCA6"/>
      <stop offset="100%" stop-color="#D89A2B"/>
    </radialGradient>
    <filter id="soft-shadow-{island_slug}" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#5043C9" flood-opacity="0.12"/>
    </filter>
  </defs>
  <!-- Base circular dorada con sombra suave -->
  <circle cx="60" cy="60" r="54" fill="url(#gold-grad-{island_slug})" filter="url(#soft-shadow-{island_slug})" stroke="#B87B14" stroke-width="2"/>
  <!-- Anillo concéntrico punteado estilo pasaporte -->
  <circle cx="60" cy="60" r="47" fill="none" stroke="#9A650C" stroke-width="1.5" stroke-dasharray="3,3" opacity="0.8"/>
  <!-- Borde interior sutil -->
  <circle cx="60" cy="60" r="42" fill="none" stroke="#D89A2B" stroke-width="0.8" opacity="0.6"/>
  <!-- Glifo icónico central de la isla -->
  <g transform="translate(60, 60)" fill="#7A4E04">
    {glyph_path}
  </g>
</svg>'''

    output_path.write_text(svg_content, encoding="utf-8")
    print(f"[OK] Sello generado: {output_path.name} ({output_path.stat().st_size / 1024:.1f} KB)")


def generate_all_stamps():
    """
    Crea los 6 sellos de pasaporte para las islas del MVP.
    """
    sellos_dir = ARTE_DIR / "sellos"
    stamps = [
        ("nido", "Isla Nido", '<ellipse cx="0" cy="2" rx="14" ry="17" opacity="0.9"/><path d="M-10,12 C-5,16 5,16 10,12" stroke="#FFF5D6" stroke-width="2" fill="none"/>'),
        ("reloj", "Isla Reloj", '<circle cx="0" cy="0" r="16" fill="none" stroke="#7A4E04" stroke-width="3"/><line x1="0" y1="0" x2="0" y2="-9" stroke="#7A4E04" stroke-width="2.5" stroke-linecap="round"/><line x1="0" y1="0" x2="7" y2="3" stroke="#7A4E04" stroke-width="2.5" stroke-linecap="round"/><circle cx="0" cy="0" r="2.5" fill="#FFF5D6"/>'),
        ("horarios", "Isla Horarios", '<path d="M-12,8 C-12,0 -8,-14 0,-14 C8,-14 12,0 12,8 L15,11 L-15,11 Z"/><circle cx="0" cy="14" r="2.5"/>'),
        ("animo", "Isla Ánimo", '<path d="M-14,0 C-14,-9 -7,-14 0,-7 C7,-14 14,-9 14,0 C14,8 0,16 0,16 C0,16 -14,8 -14,0 Z"/>'),
        ("cerebro", "Isla Cerebro", '<circle cx="-6" cy="-4" r="8"/><circle cx="6" cy="-4" r="8"/><circle cx="-5" cy="5" r="7"/><circle cx="5" cy="5" r="7"/><circle cx="0" cy="0" r="5" fill="#FFF5D6"/>'),
        ("taller", "Isla Taller", '<path d="M-10,-12 L-6,-16 L12,2 L8,6 Z"/><circle cx="10" cy="4" r="5" fill="none" stroke="#7A4E04" stroke-width="2"/><circle cx="-9" cy="-13" r="2" fill="#FFF5D6"/>')
    ]

    for slug, title, glyph in stamps:
        out_file = sellos_dir / f"sello-{slug}.svg"
        generate_stamp_svg(slug, title, glyph, out_file)


def process_all_assets():
    """
    Procesa todas las imágenes existentes y generadas, convirtiéndolas a SVG optimizado.
    """
    print("\n--- 1. Sellos de Pasaporte ---")
    generate_all_stamps()

    print("\n--- 2. Expresiones de Nubi y Accesorios ---")
    nubi_dir = ARTE_DIR / "nubiExpresiones"
    nubi_items = [
        # (origen, destino relativo, max_dim, is_transparent)
        (nubi_dir / "nubi-neutral.jpg", "nubi/nubi-neutral.svg", 320, True),
        (nubi_dir / "nubi-feliz.jpg", "nubi/nubi-feliz.svg", 320, True),
        (nubi_dir / "nubi-curioso.jpg", "nubi/nubi-curiosa.svg", 320, True),
        (nubi_dir / "nubi-pensando.jpg", "nubi/nubi-pensando.svg", 320, True),
        (nubi_dir / "nubi-celebrando.jpg", "nubi/nubi-celebrando.svg", 320, True),
        (nubi_dir / "nubi-cansado.jpg", "nubi/nubi-soñolienta.svg", 320, True),
        (nubi_dir / "nubi-narrador.jpg", "nubi/nubi-narrando.svg", 320, True),
        (nubi_dir / "nubi-base.jpg", "nubi/nubi-base.svg", 320, True),
        # Generados recientemente
        (GENERADOS_DIR / "nubi-apoyando.jpg", "nubi/nubi-apoyando.svg", 320, True),
        (GENERADOS_DIR / "acc-gorro-dormir.jpg", "nubi/acc-gorro-dormir.svg", 256, True),
        (GENERADOS_DIR / "acc-bufanda-estrellas.jpg", "nubi/acc-bufanda-estrellas.svg", 256, True),
        (GENERADOS_DIR / "acc-lentes-luna.jpg", "nubi/acc-lentes-luna.svg", 256, True),
    ]
    for src, dst_rel, dim, trans in nubi_items:
        if src.exists():
            vectorize_image(src, ARTE_DIR / dst_rel, max_dim=dim, is_transparent=trans)

    print("\n--- 3. Miniaturas de Islas (Mapa) ---")
    isla_items = [
        (nubi_dir / "nido.jpeg", "islas/nido.svg", 220, True),
        (nubi_dir / "torreRelojAmanecer.jpeg", "islas/reloj.svg", 220, True),
        (nubi_dir / "horarios.jpeg", "islas/horarios.svg", 220, True),
        (nubi_dir / "animo.jpeg", "islas/animo.svg", 220, True),
        (nubi_dir / "cerebro.jpeg", "islas/cerebro.svg", 220, True),
        (nubi_dir / "taller.jpeg", "islas/taller.svg", 220, True),
        (GENERADOS_DIR / "isla-niebla.jpg", "islas/isla-niebla.svg", 220, True),
    ]
    for src, dst_rel, dim, trans in isla_items:
        if src.exists():
            vectorize_image(src, ARTE_DIR / dst_rel, max_dim=dim, is_transparent=trans)

    print("\n--- 4. Escenas Narrativas y Macro ---")
    escenas_items = [
        # Escenas 16:9 (fondo integrado)
        (GENERADOS_DIR / "nido-1.jpg", "escenas/nido-1.svg", 440, False),
        (GENERADOS_DIR / "reloj-1.jpg", "escenas/reloj-1.svg", 440, False),
        (GENERADOS_DIR / "reloj-2.jpg", "escenas/reloj-2.svg", 440, False),
        (GENERADOS_DIR / "horarios-1.jpg", "escenas/horarios-1.svg", 440, False),
        (GENERADOS_DIR / "horarios-2.jpg", "escenas/horarios-2.svg", 440, False),
        (GENERADOS_DIR / "animo-1.jpg", "escenas/animo-1.svg", 440, False),
        # Piezas Macro 4:5
        (GENERADOS_DIR / "hero-portada.jpg", "hero-portada.svg", 400, False),
        (GENERADOS_DIR / "coronacion.jpg", "coronacion.svg", 400, False),
    ]
    for src, dst_rel, dim, trans in escenas_items:
        if src.exists():
            vectorize_image(src, ARTE_DIR / dst_rel, max_dim=dim, is_transparent=trans)


if __name__ == "__main__":
    print("Iniciando pipeline de vectorizado y optimización...")
    process_all_assets()
    print("\nPipeline completado exitosamente.")
