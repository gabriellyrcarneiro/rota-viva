# Rota Viva

Aplicativo mobile em React Native + Expo para o Projeto Extra da disciplina Desenvolvimento para Dispositivos Moveis - 2026.1.

O Rota Viva e um guia de viagem com destinos brasileiros, detalhes de cada local, cadastro de rotas, GPS, camera/galeria e sensor de movimento.

## Funcionalidades

- Lista de destinos brasileiros com imagem, categoria, estado, melhor epoca, pontos de interesse e roteiro sugerido.
- Tela de detalhes por destino, com coordenadas, distancia calculada pelo GPS e acao para cadastrar rota.
- Cadastro de rotas com nome, destino, data, observacoes e persistencia local via AsyncStorage.
- Uso de GPS com `expo-location` para obter latitude/longitude e calcular o destino mais proximo.
- Uso de camera e galeria com `expo-image-picker` para montar um diario visual da viagem.
- Uso do acelerometro com `expo-sensors` para demonstrar leitura de movimento nos eixos X, Y e Z.

## Tecnologias

- React Native
- Expo SDK 54
- JavaScript
- AsyncStorage
- Expo Location
- Expo Image Picker
- Expo Sensors

## Como executar

```bash
npm install
npm run start
```

Depois, abra o app pelo Expo Go no celular ou por um emulador Android/iOS.

Para testar em aparelho fisico, use o QR Code exibido pelo Expo. GPS, camera, galeria e acelerometro funcionam melhor no celular real.

## Permissoes usadas

- Localizacao: calcular distancias e salvar um ponto GPS na rota.
- Camera: tirar uma foto para o diario visual.
- Galeria: selecionar uma imagem existente.
- Sensor de movimento: ler o acelerometro do aparelho.

## Estrutura principal

- `App.js`: telas, dados dos destinos, cadastro de rotas, GPS, midia e sensor.
- `app.json`: configuracoes do Expo e permissoes nativas.
- `index.js`: registro do componente principal.

## Checklist de avaliacao

- Abrir a aba Destinos e mostrar a lista.
- Entrar em um destino e mostrar detalhes do local.
- Usar o botao de GPS e mostrar as coordenadas/distancia.
- Cadastrar uma rota na aba Rotas.
- Tirar uma foto ou escolher uma imagem da galeria.
- Abrir a aba Sensor e iniciar o acelerometro.
- Mostrar o historico de commits no GitHub.
