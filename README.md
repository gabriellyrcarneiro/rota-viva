# Rota Viva

Aplicativo mobile em **React Native + Expo** para o Projeto Extra da disciplina Desenvolvimento para **Dispositivos Moveis - 2026.1.**

O Rota Viva é **um guia de viagem com destinos brasileiros**, detalhes de cada local, cadastro de rotas, GPS, camera/galeria e sensor de movimento.

## Funcionalidades

- Lista de destinos brasileiros com imagem, categoria, estado, melhor epoca, pontos de interesse e roteiro sugerido.
- Tela de detalhes por destino, com coordenadas, distancia calculada pelo GPS e acao para cadastrar rota.
- Cadastro de rotas com nome, destino, data, observacoes e persistencia local via AsyncStorage.
- Uso de GPS com `expo-location` para obter latitude/longitude e calcular o destino mais proximo.
- Uso de camera e galeria com `expo-image-picker` para montar um diario visual da viagem.
- Uso do acelerometro com `expo-sensors` para demonstrar leitura de movimento nos eixos X, Y e Z.

## Prints do projeto

<p align="center">
  <img width="220" alt="Tela de destinos" src="https://github.com/user-attachments/assets/1927fe48-01fa-430f-b10a-476cf5f56b1e" />
  <img width="220" alt="Detalhes do destino" src="https://github.com/user-attachments/assets/c0fedd3b-8bfa-4f5e-aa11-0a39bbb304a1" />
</p>

<p align="center">
  <img width="220" alt="Cadastro de rotas" src="https://github.com/user-attachments/assets/5b9853f1-e54e-4568-af20-91c15e78fe4f" />
  <img width="220" alt="Sensor de movimento" src="https://github.com/user-attachments/assets/c0c68d87-08bc-4fca-b7ae-ddfcbd921761" />
</p>

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

## Permissões usadas

- Localização: calcular distâncias e salvar um ponto GPS na rota.
- Câmera: tirar uma foto para o diário visual.
- Galeria: selecionar uma imagem existente.
- Sensor de movimento: ler o acelerometro do aparelho.

## Estrutura principal

- `App.js`: telas, dados dos destinos, cadastro de rotas, GPS, midia e sensor.
- `app.json`: configuracoes do Expo e permissoes nativas.
- `index.js`: registro do componente principal.



## Feito por: 
** 👩‍🎓 🚀 Gabrielly Rodrigues**
