#!/bin/bash

# Diretório onde estão localizadas as imagens a serem removidas.
DIR_ORIGEM="./img"

# Comando find para procurar por arquivos .jpg e removê-los
find "$DIR_ORIGEM" -type f -name "*.jpg" -exec rm {} \;

echo "Todas as imagens .jpg em $DIR_ORIGEM foram removidas."
