# Roteiro de apresentacao - Rota Viva

## Tempo sugerido

Uma apresentacao de 5 a 7 minutos funciona bem:

1. Contexto do projeto: 40 segundos.
2. Tecnologias usadas: 50 segundos.
3. Demonstracao das telas: 3 a 4 minutos.
4. GitHub e commits: 40 segundos.
5. Fechamento: 30 segundos.

## Fala inicial

"Este projeto se chama Rota Viva. Ele foi desenvolvido em React Native com Expo para a disciplina Desenvolvimento para Dispositivos Moveis. A proposta e ser um guia de viagem com destinos brasileiros, permitindo consultar detalhes, cadastrar rotas e usar recursos nativos do celular, como GPS, camera, galeria e sensor de movimento."

## Ordem da demonstracao

1. Abra a aba Destinos.
   - Mostre que existem varios destinos brasileiros.
   - Explique que cada card tem categoria, estado, melhor epoca, descricao e pontos de interesse.

2. Toque em um destino.
   - Mostre a tela de detalhes.
   - Destaque coordenadas, duracao sugerida, melhor epoca, pontos de interesse e roteiro.
   - Use o botao "Cadastrar rota" para mostrar integracao entre telas.

3. Demonstre GPS.
   - Toque em "GPS" ou "Usar GPS".
   - Permita a localizacao no aparelho.
   - Mostre latitude/longitude e distancia aproximada ate o destino mais proximo.
   - Explique que o calculo usa a formula de distancia entre coordenadas.

4. Cadastre uma rota.
   - Na aba Rotas, preencha nome, destino, data e observacoes.
   - Salve a rota.
   - Feche e reabra o app se quiser provar persistencia local com AsyncStorage.

5. Demonstre camera e galeria.
   - Toque em "Camera" para tirar uma foto.
   - Toque em "Galeria" para escolher uma imagem.
   - Mostre que a imagem aparece no diario visual.

6. Demonstre sensor de movimento.
   - Abra a aba Sensor.
   - Toque em "Iniciar sensor".
   - Movimente levemente o celular e mostre a mudanca dos eixos X, Y e Z e da barra de intensidade.

7. Mostre GitHub.
   - Abra o repositorio no GitHub.
   - Mostre os commits semanticos.
   - Sugestao de comando local:

```bash
git log --oneline
```

## Pontos tecnicos para comentar

- O app foi construido em uma unica base React Native com Expo.
- `expo-location` acessa o GPS com permissao do usuario.
- `expo-image-picker` abre camera e galeria.
- `expo-sensors` le o acelerometro.
- `@react-native-async-storage/async-storage` salva as rotas localmente.
- A interface foi organizada em tres abas: Destinos, Rotas e Sensor.

## Plano B para a sala

- Se o emulador nao abrir camera, use um celular fisico com Expo Go.
- Se o GPS demorar, explique que depende da permissao e do sensor do aparelho.
- Se a internet da sala estiver instavel, deixe o app aberto antes da apresentacao.
- Se as imagens remotas nao carregarem, continue a demo pelas funcionalidades nativas e pelos dados textuais dos destinos.

## Fechamento

"Com isso, o Rota Viva atende aos requisitos do projeto: interface mobile em React Native + Expo, destinos brasileiros com detalhes, cadastro de rotas, GPS, camera/galeria, sensor de movimento, persistencia local e versionamento com commits semanticos no GitHub."

