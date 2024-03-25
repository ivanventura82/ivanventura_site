#!/bin/bash

# Diretório onde estão localizadas as imagens originais
DIR_ORIGEM="./img/docol2004"

# Loop através de subpastas e imagens dentro de /img
find "$DIR_ORIGEM" -type f -name "*.png" | while read imagem; do
    echo "Processando $imagem..."

    # Define o caminho e o nome base para as imagens convertidas
    CAMINHO_BASE=$(echo $imagem | sed 's/.png//')

    # Conversão para 720w com crop específico
    convert "$imagem" -resize "x1334" -gravity center -crop 720x1334+0+0 +repage -quality 80 "${CAMINHO_BASE}-720w.webp"

    # Conversão para 1024w
    convert "$imagem" -resize 1024x -quality 80 "${CAMINHO_BASE}-1024w.webp"

    # Conversão para 1920w
    convert "$imagem" -resize 1920x -quality 80 "${CAMINHO_BASE}-1920w.webp"

    # Remoção da imagem original em JPG, descomente a linha abaixo se deseja remover
    # rm "$imagem"

    echo "$imagem convertida e original removida."
done

echo "Conversão completada."


