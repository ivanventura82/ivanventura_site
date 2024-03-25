#!/bin/bash

# Diretório raiz onde as imagens estão localizadas
rootDir="./img"
# Largura alvo para as imagens de mobile
width=480
# Extensão do arquivo de imagem
ext="webp"

# Função para processar imagens em um diretório
processImages() {
    local currentDir="$1"
    
    # Criando o diretório de saída se não existir
    local outputDir="${currentDir}/mobile"
    if [ ! -d "$outputDir" ]; then
        mkdir -p "$outputDir"
    fi

    # Encontrando e processando todas as imagens .webp
    find "$currentDir" -maxdepth 1 -type f -name "*.$ext" | while read img; do
        local filename=$(basename "$img")
        local outputFile="${outputDir}/${filename%.*}-mobile.$ext"
        
        # Redimensionando a imagem para a largura alvo mantendo a proporção
        magick convert "$img" -resize "${width}x" "$outputFile"
        
        echo "Imagem redimensionada e salva como: $outputFile"
    done
}

export -f processImages
export width
export ext
export magick

# Percorrendo subdiretórios de "$rootDir" e processando imagens
find "$rootDir" -type d -print0 | xargs -0 -I {} bash -c 'processImages "$@"' _ {}

echo "Todas as imagens foram processadas."
