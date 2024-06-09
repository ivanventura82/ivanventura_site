#!/bin/bash

# Diretório base contendo as pastas dos projetos, ajustado para partir da raiz do site
PROJECTS_DIR="./src/img"

# Loop através de cada subdiretório do diretório de projetos
for project_dir in "$PROJECTS_DIR"/*; do
  if [ -d "$project_dir" ]; then
    echo "Otimizando imagens no projeto: $(basename "$project_dir")"

    # Otimizar todas as imagens WebP no subdiretório atual
    find "$project_dir" -iname '*.webp' -exec convert {} -strip -quality 80 {} \;
  fi
done

echo "Otimização de imagens WebP concluída para todos os projetos!"
