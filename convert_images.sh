#!/bin/bash

# Loop através das imagens passadas como argumentos
for imagem in "$@"
do
    echo "Processando $imagem..."

    # Verifica se o arquivo existe
    if [[ ! -f $imagem ]]; then
        echo "Arquivo $imagem não encontrado!"
        continue
    fi

    # Define o caminho e o nome base para as imagens convertidas
    CAMINHO_BASE=$(echo $imagem | sed 's/.webp//')

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


