#!/bin/bash

# Diretório base contendo as pastas dos projetos
PROJECTS_DIR="./src/img"

# Limite de tamanho do arquivo em kilobytes (250 KB)
SIZE_LIMIT=256000  # 250 KB em bytes

# Qualidade da imagem a ser usada na otimização
QUALITY=${1:-80}  # Usa 80 como padrão se nenhum argumento for fornecido

# Loop através de cada subdiretório do diretório de projetos
for project_dir in "$PROJECTS_DIR"/*; do
  if [ -d "$project_dir" ]; then
    echo "Verificando projeto: $(basename "$project_dir")"

    # Encontrar todas as imagens WebP no subdiretório atual que são maiores que 250 KB
    find "$project_dir" -iname '*.webp' -size +${SIZE_LIMIT}c -exec echo "Otimizando: {}" \; -exec convert {} -strip -quality $QUALITY {} \;
  fi
done

echo "Otimização de imagens WebP maiores que 250 KB concluída para todos os projetos com qualidade $QUALITY!"
