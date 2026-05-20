import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Accelerometer } from 'expo-sensors';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const STORAGE_KEY = '@rota-viva/routes-v1';

const DESTINATIONS = [
  {
    id: 'lencois',
    name: 'Lençóis Maranhenses',
    state: 'Maranhão',
    region: 'Nordeste',
    category: 'Natureza',
    coordinates: { latitude: -2.485, longitude: -43.1286 },
    bestSeason: 'Junho a setembro',
    duration: '4 a 5 dias',
    accent: '#006d77',
    accentSoft: '#d7f4f0',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    description:
      'Um encontro raro entre dunas brancas, lagoas de água doce e vilas tranquilas. É um destino perfeito para falar de preservação ambiental, deslocamento regional e turismo de base local.',
    highlights: ['Lagoa Bonita', 'Circuito Lagoa Azul', 'Atins', 'Travessia guiada'],
    itinerary: ['Chegada em Barreirinhas', 'Passeio 4x4 nas lagoas', 'Dia em Atins', 'Pôr do sol nas dunas'],
  },
  {
    id: 'chapada',
    name: 'Chapada Diamantina',
    state: 'Bahia',
    region: 'Nordeste',
    category: 'Aventura',
    coordinates: { latitude: -12.5616, longitude: -41.3927 },
    bestSeason: 'Abril a outubro',
    duration: '5 a 7 dias',
    accent: '#d95d39',
    accentSoft: '#ffe2d6',
    image:
      'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&w=1200&q=80',
    description:
      'Região de trilhas, cachoeiras, grutas e mirantes. A base em Lençóis permite montar rotas para viajantes que gostam de caminhada e experiências ao ar livre.',
    highlights: ['Morro do Pai Inácio', 'Poço Azul', 'Cachoeira da Fumaça', 'Vale do Pati'],
    itinerary: ['Centro histórico de Lençóis', 'Mirante do Pai Inácio', 'Poços e grutas', 'Trilha no Vale do Pati'],
  },
  {
    id: 'bonito',
    name: 'Bonito',
    state: 'Mato Grosso do Sul',
    region: 'Centro-Oeste',
    category: 'Ecoturismo',
    coordinates: { latitude: -21.1261, longitude: -56.4836 },
    bestSeason: 'Maio a setembro',
    duration: '4 dias',
    accent: '#2a9d8f',
    accentSoft: '#dbf5ef',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
    description:
      'Destino referência em turismo sustentável, com rios transparentes, flutuação, grutas e controle de visitantes. É ótimo para demonstrar planejamento de reservas.',
    highlights: ['Rio da Prata', 'Gruta do Lago Azul', 'Nascente Azul', 'Abismo Anhumas'],
    itinerary: ['Check-in e centro', 'Flutuação', 'Gruta do Lago Azul', 'Balneário municipal'],
  },
  {
    id: 'iguacu',
    name: 'Foz do Iguaçu',
    state: 'Paraná',
    region: 'Sul',
    category: 'Patrimônio',
    coordinates: { latitude: -25.6953, longitude: -54.4367 },
    bestSeason: 'Março a novembro',
    duration: '3 dias',
    accent: '#457b9d',
    accentSoft: '#ddefff',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    description:
      'As cataratas formam uma experiência marcante de natureza, fronteira e infraestrutura turística. O destino permite discutir mapas, localização e deslocamento.',
    highlights: ['Cataratas', 'Parque das Aves', 'Marco das Três Fronteiras', 'Itaipu'],
    itinerary: ['Parque Nacional', 'Macuco Safari', 'Parque das Aves', 'Noite no Marco'],
  },
  {
    id: 'ouro-preto',
    name: 'Ouro Preto',
    state: 'Minas Gerais',
    region: 'Sudeste',
    category: 'Cultura',
    coordinates: { latitude: -20.3856, longitude: -43.5036 },
    bestSeason: 'Abril a setembro',
    duration: '2 a 3 dias',
    accent: '#8d6e63',
    accentSoft: '#efe2d8',
    image:
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1200&q=80',
    description:
      'Cidade histórica com igrejas, ladeiras, museus e forte identidade arquitetônica. Boa opção para um roteiro curto e rico em conteúdo cultural.',
    highlights: ['Praça Tiradentes', 'Igreja São Francisco', 'Museu da Inconfidência', 'Mina da Passagem'],
    itinerary: ['Centro histórico', 'Circuito das igrejas', 'Museus', 'Bate-volta em Mariana'],
  },
  {
    id: 'alter',
    name: 'Alter do Chão',
    state: 'Pará',
    region: 'Norte',
    category: 'Praia de rio',
    coordinates: { latitude: -2.5045, longitude: -54.9528 },
    bestSeason: 'Agosto a dezembro',
    duration: '4 dias',
    accent: '#f4a261',
    accentSoft: '#fff0db',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
    description:
      'Praias de água doce, comunidades ribeirinhas e paisagens amazônicas. É um destino forte para apresentar diversidade regional e turismo responsável.',
    highlights: ['Ilha do Amor', 'Floresta Nacional do Tapajós', 'Ponta do Cururu', 'Canal do Jari'],
    itinerary: ['Vila de Alter', 'Ilha do Amor', 'Passeio de barco', 'Comunidade ribeirinha'],
  },
];

const TABS = [
  { id: 'destinos', label: 'Destinos' },
  { id: 'rotas', label: 'Rotas' },
  { id: 'sensor', label: 'Sensor' },
];

function getDistanceKm(origin, destination) {
  if (!origin) {
    return null;
  }

  const earthRadius = 6371;
  const toRadians = (value) => (value * Math.PI) / 180;
  const deltaLat = toRadians(destination.latitude - origin.latitude);
  const deltaLon = toRadians(destination.longitude - origin.longitude);
  const lat1 = toRadians(origin.latitude);
  const lat2 = toRadians(destination.latitude);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
}

function formatCoordinate(value) {
  return value.toFixed(4).replace('.', ',');
}

function getDestinationById(id) {
  return DESTINATIONS.find((destination) => destination.id === id) ?? DESTINATIONS[0];
}

export default function App() {
  const [activeTab, setActiveTab] = useState('destinos');
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [routesLoaded, setRoutesLoaded] = useState(false);
  const [routeForm, setRouteForm] = useState({
    title: '',
    destinationId: DESTINATIONS[0].id,
    travelDate: '',
    notes: '',
  });
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationMessage, setLocationMessage] = useState('GPS ainda não ativado.');
  const [locationLoading, setLocationLoading] = useState(false);
  const [mediaItems, setMediaItems] = useState([]);
  const [sensorEnabled, setSensorEnabled] = useState(false);
  const [accelerometerData, setAccelerometerData] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    async function loadRoutes() {
      try {
        const savedRoutes = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedRoutes) {
          setRoutes(JSON.parse(savedRoutes));
        }
      } catch (error) {
        Alert.alert('Rotas', 'Não foi possível carregar as rotas salvas.');
      } finally {
        setRoutesLoaded(true);
      }
    }

    loadRoutes();
  }, []);

  useEffect(() => {
    if (!routesLoaded) {
      return;
    }

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(routes)).catch(() => {
      Alert.alert('Rotas', 'Não foi possível salvar as rotas neste dispositivo.');
    });
  }, [routes, routesLoaded]);

  useEffect(() => {
    let subscription;

    if (sensorEnabled) {
      Accelerometer.setUpdateInterval(450);
      subscription = Accelerometer.addListener((data) => {
        setAccelerometerData(data);
      });
    }

    return () => {
      subscription?.remove();
    };
  }, [sensorEnabled]);

  const destinationsWithDistance = useMemo(
    () =>
      DESTINATIONS.map((destination) => ({
        ...destination,
        distanceKm: getDistanceKm(currentLocation, destination.coordinates),
      })),
    [currentLocation],
  );

  const nearestDestination = useMemo(() => {
    if (!currentLocation) {
      return null;
    }

    return [...destinationsWithDistance].sort((a, b) => a.distanceKm - b.distanceKm)[0];
  }, [currentLocation, destinationsWithDistance]);

  const motionMagnitude = Math.sqrt(
    accelerometerData.x * accelerometerData.x +
      accelerometerData.y * accelerometerData.y +
      accelerometerData.z * accelerometerData.z,
  );
  const motionIntensity = Math.min(1, Math.abs(motionMagnitude - 1) * 2.4);
  const motionLabel =
    motionIntensity < 0.18 ? 'Estável' : motionIntensity < 0.55 ? 'Movimento moderado' : 'Movimento intenso';

  async function requestCurrentLocation() {
    try {
      setLocationLoading(true);
      setLocationMessage('Buscando sua localização...');

      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== 'granted') {
        setLocationMessage('Permissão de localização negada.');
        Alert.alert('GPS', 'Ative a permissão de localização para calcular distâncias.');
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      setCurrentLocation(location);
      setLocationMessage(
        `GPS ativo: ${formatCoordinate(location.latitude)}, ${formatCoordinate(location.longitude)}`,
      );
    } catch (error) {
      setLocationMessage('Não foi possível obter o GPS agora.');
      Alert.alert('GPS', 'Confira se o GPS do dispositivo está ligado e tente novamente.');
    } finally {
      setLocationLoading(false);
    }
  }

  function updateRouteForm(field, value) {
    setRouteForm((current) => ({ ...current, [field]: value }));
  }

  function prepareRouteFor(destination) {
    setRouteForm((current) => ({
      ...current,
      destinationId: destination.id,
      title: current.title || `Rota para ${destination.name}`,
    }));
    setSelectedDestination(null);
    setActiveTab('rotas');
  }

  function addRoute() {
    const destination = getDestinationById(routeForm.destinationId);
    const title = routeForm.title.trim();

    if (!title) {
      Alert.alert('Cadastro de rota', 'Informe um nome para a rota.');
      return;
    }

    const newRoute = {
      id: String(Date.now()),
      title,
      destinationId: destination.id,
      destinationName: destination.name,
      travelDate: routeForm.travelDate.trim() || 'Data a definir',
      notes: routeForm.notes.trim() || 'Sem observações.',
      createdAt: new Date().toISOString(),
      locationSnapshot: currentLocation,
    };

    setRoutes((current) => [newRoute, ...current]);
    setRouteForm({
      title: '',
      destinationId: destination.id,
      travelDate: '',
      notes: '',
    });
  }

  function removeRoute(routeId) {
    Alert.alert('Excluir rota', 'Deseja remover esta rota cadastrada?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => setRoutes((current) => current.filter((route) => route.id !== routeId)),
      },
    ]);
  }

  function addMediaResult(result, source) {
    if (result.canceled || !result.assets?.length) {
      return;
    }

    const asset = result.assets[0];
    setMediaItems((current) =>
      [
        {
          id: String(Date.now()),
          uri: asset.uri,
          source,
          addedAt: new Date().toLocaleDateString('pt-BR'),
        },
        ...current,
      ].slice(0, 8),
    );
  }

  async function takePhoto() {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Câmera', 'Permita o uso da câmera para registrar a rota.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      addMediaResult(result, 'Câmera');
    } catch (error) {
      Alert.alert('Câmera', 'Não foi possível abrir a câmera.');
    }
  }

  async function pickFromGallery() {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Galeria', 'Permita o acesso à galeria para anexar imagens.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      addMediaResult(result, 'Galeria');
    } catch (error) {
      Alert.alert('Galeria', 'Não foi possível abrir a galeria.');
    }
  }

  function renderDestinationCard(destination) {
    return (
      <TouchableOpacity
        key={destination.id}
        activeOpacity={0.88}
        style={styles.destinationCard}
        onPress={() => setSelectedDestination(destination)}
      >
        <Image source={{ uri: destination.image }} style={styles.destinationImage} />
        <View style={styles.destinationBody}>
          <View style={styles.cardTopLine}>
            <Text style={[styles.pill, { backgroundColor: destination.accentSoft, color: destination.accent }]}>
              {destination.category}
            </Text>
            <Text style={styles.distanceText}>
              {destination.distanceKm ? `${Math.round(destination.distanceKm)} km` : destination.region}
            </Text>
          </View>
          <Text style={styles.destinationName}>{destination.name}</Text>
          <Text style={styles.destinationMeta}>
            {destination.state} • {destination.bestSeason}
          </Text>
          <Text style={styles.destinationDescription} numberOfLines={3}>
            {destination.description}
          </Text>
          <View style={styles.tagRow}>
            {destination.highlights.slice(0, 3).map((highlight) => (
              <Text key={highlight} style={styles.tag}>
                {highlight}
              </Text>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  function renderDestinations() {
    return (
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.screenContent}>
        <View style={styles.hero}>
          <Text style={styles.heroKicker}>Guia mobile brasileiro</Text>
          <Text style={styles.heroTitle}>Rota Viva</Text>
          <Text style={styles.heroCopy}>
            Destinos, rotas pessoais, GPS, mídia e sensor em uma experiência criada para a disciplina de
            Desenvolvimento para Dispositivos Móveis.
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{DESTINATIONS.length}</Text>
              <Text style={styles.statLabel}>destinos</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{routes.length}</Text>
              <Text style={styles.statLabel}>rotas</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{mediaItems.length}</Text>
              <Text style={styles.statLabel}>fotos</Text>
            </View>
          </View>
        </View>

        <View style={styles.gpsCard}>
          <View style={styles.gpsTextBlock}>
            <Text style={styles.sectionEyebrow}>GPS</Text>
            <Text style={styles.gpsTitle}>{locationMessage}</Text>
            {nearestDestination ? (
              <Text style={styles.gpsSubtitle}>
                Mais próximo: {nearestDestination.name}, a {Math.round(nearestDestination.distanceKm)} km.
              </Text>
            ) : (
              <Text style={styles.gpsSubtitle}>Ative a localização para calcular distâncias aproximadas.</Text>
            )}
          </View>
          <TouchableOpacity style={styles.smallActionButton} onPress={requestCurrentLocation} disabled={locationLoading}>
            <Text style={styles.smallActionText}>{locationLoading ? '...' : 'Usar GPS'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Destinos em destaque</Text>
        {destinationsWithDistance.map(renderDestinationCard)}
      </ScrollView>
    );
  }

  function renderRoutes() {
    const selectedDestination = getDestinationById(routeForm.destinationId);

    return (
      <KeyboardAvoidingView
        style={styles.keyboardScreen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.screenContent}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionEyebrow}>Planejamento</Text>
              <Text style={styles.sectionTitle}>Cadastro de rotas</Text>
            </View>
            <Text style={styles.counterBadge}>{routes.length} salvas</Text>
          </View>

          <View style={styles.formPanel}>
            <Text style={styles.inputLabel}>Nome da rota</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Férias no Jalapão"
              placeholderTextColor="#89938d"
              value={routeForm.title}
              onChangeText={(value) => updateRouteForm('title', value)}
            />

            <Text style={styles.inputLabel}>Destino</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              {DESTINATIONS.map((destination) => {
                const selected = destination.id === routeForm.destinationId;
                return (
                  <TouchableOpacity
                    key={destination.id}
                    style={[styles.choiceChip, selected && { borderColor: destination.accent, backgroundColor: destination.accentSoft }]}
                    onPress={() => updateRouteForm('destinationId', destination.id)}
                  >
                    <Text style={[styles.choiceChipText, selected && { color: destination.accent }]}>
                      {destination.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.twoColumn}>
              <View style={styles.formColumn}>
                <Text style={styles.inputLabel}>Data</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 12/07/2026"
                  placeholderTextColor="#89938d"
                  value={routeForm.travelDate}
                  onChangeText={(value) => updateRouteForm('travelDate', value)}
                />
              </View>
              <View style={styles.formColumn}>
                <Text style={styles.inputLabel}>Duração sugerida</Text>
                <View style={styles.readOnlyInput}>
                  <Text style={styles.readOnlyText}>{selectedDestination.duration}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.inputLabel}>Observações</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Hospedagem, transporte, orçamento ou pontos de parada"
              placeholderTextColor="#89938d"
              value={routeForm.notes}
              multiline
              onChangeText={(value) => updateRouteForm('notes', value)}
            />

            <TouchableOpacity style={styles.primaryButton} onPress={addRoute}>
              <Text style={styles.primaryButtonText}>Salvar rota</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.mediaPanel}>
            <View style={styles.sectionHeaderCompact}>
              <View>
                <Text style={styles.sectionEyebrow}>Diário visual</Text>
                <Text style={styles.panelTitle}>Câmera e galeria</Text>
              </View>
              <View style={styles.mediaActions}>
                <TouchableOpacity style={styles.secondaryButton} onPress={takePhoto}>
                  <Text style={styles.secondaryButtonText}>Câmera</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton} onPress={pickFromGallery}>
                  <Text style={styles.secondaryButtonText}>Galeria</Text>
                </TouchableOpacity>
              </View>
            </View>

            {mediaItems.length ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.mediaStrip}>
                {mediaItems.map((item) => (
                  <View key={item.id} style={styles.mediaThumbWrapper}>
                    <Image source={{ uri: item.uri }} style={styles.mediaThumb} />
                    <Text style={styles.mediaCaption}>
                      {item.source} • {item.addedAt}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <Text style={styles.emptyText}>Nenhuma imagem anexada ainda.</Text>
            )}
          </View>

          <Text style={styles.sectionTitle}>Rotas cadastradas</Text>
          {routes.length ? (
            routes.map((route) => {
              const destination = getDestinationById(route.destinationId);
              return (
                <View key={route.id} style={styles.routeCard}>
                  <View style={styles.routeCardTop}>
                    <Text style={[styles.pill, { backgroundColor: destination.accentSoft, color: destination.accent }]}>
                      {route.destinationName}
                    </Text>
                    <TouchableOpacity onPress={() => removeRoute(route.id)}>
                      <Text style={styles.deleteText}>Excluir</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.routeTitle}>{route.title}</Text>
                  <Text style={styles.destinationMeta}>{route.travelDate}</Text>
                  <Text style={styles.routeNotes}>{route.notes}</Text>
                  {route.locationSnapshot ? (
                    <Text style={styles.routeGps}>
                      GPS salvo: {formatCoordinate(route.locationSnapshot.latitude)},{' '}
                      {formatCoordinate(route.locationSnapshot.longitude)}
                    </Text>
                  ) : null}
                </View>
              );
            })
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>Nenhuma rota cadastrada</Text>
              <Text style={styles.emptyText}>Salve uma rota para demonstrar persistência local com AsyncStorage.</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  function renderSensor() {
    return (
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.screenContent}>
        <View style={styles.sensorPanel}>
          <Text style={styles.sectionEyebrow}>Acelerômetro</Text>
          <Text style={styles.sensorTitle}>Sensor de movimento</Text>
          <Text style={styles.sensorStatus}>{sensorEnabled ? motionLabel : 'Sensor pausado'}</Text>

          <View style={styles.motionMeter}>
            <View style={[styles.motionFill, { width: `${Math.max(8, motionIntensity * 100)}%` }]} />
          </View>

          <View style={styles.axisGrid}>
            <View style={styles.axisBox}>
              <Text style={styles.axisLabel}>X</Text>
              <Text style={styles.axisValue}>{accelerometerData.x.toFixed(2)}</Text>
            </View>
            <View style={styles.axisBox}>
              <Text style={styles.axisLabel}>Y</Text>
              <Text style={styles.axisValue}>{accelerometerData.y.toFixed(2)}</Text>
            </View>
            <View style={styles.axisBox}>
              <Text style={styles.axisLabel}>Z</Text>
              <Text style={styles.axisValue}>{accelerometerData.z.toFixed(2)}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, sensorEnabled && styles.stopButton]}
            onPress={() => setSensorEnabled((current) => !current)}
          >
            <Text style={styles.primaryButtonText}>{sensorEnabled ? 'Pausar sensor' : 'Iniciar sensor'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBand}>
          <Text style={styles.panelTitle}>Como o app usa sensores</Text>
          <Text style={styles.infoText}>
            O acelerômetro captura variações nos eixos X, Y e Z e transforma a leitura em uma intensidade visual.
            Essa parte comprova integração com sensor físico do dispositivo.
          </Text>
        </View>
      </ScrollView>
    );
  }

  function renderDestinationModal() {
    if (!selectedDestination) {
      return null;
    }

    const distance = getDistanceKm(currentLocation, selectedDestination.coordinates);

    return (
      <Modal visible transparent animationType="slide" onRequestClose={() => setSelectedDestination(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Image source={{ uri: selectedDestination.image }} style={styles.modalImage} />
              <View style={styles.modalContent}>
                <View style={styles.routeCardTop}>
                  <Text
                    style={[
                      styles.pill,
                      {
                        backgroundColor: selectedDestination.accentSoft,
                        color: selectedDestination.accent,
                      },
                    ]}
                  >
                    {selectedDestination.category}
                  </Text>
                  <Pressable onPress={() => setSelectedDestination(null)}>
                    <Text style={styles.closeText}>Fechar</Text>
                  </Pressable>
                </View>

                <Text style={styles.modalTitle}>{selectedDestination.name}</Text>
                <Text style={styles.destinationMeta}>
                  {selectedDestination.state} • {selectedDestination.region}
                </Text>
                <Text style={styles.modalDescription}>{selectedDestination.description}</Text>

                <View style={styles.detailGrid}>
                  <View style={styles.detailBox}>
                    <Text style={styles.detailLabel}>Melhor época</Text>
                    <Text style={styles.detailValue}>{selectedDestination.bestSeason}</Text>
                  </View>
                  <View style={styles.detailBox}>
                    <Text style={styles.detailLabel}>Duração</Text>
                    <Text style={styles.detailValue}>{selectedDestination.duration}</Text>
                  </View>
                  <View style={styles.detailBox}>
                    <Text style={styles.detailLabel}>Coordenadas</Text>
                    <Text style={styles.detailValue}>
                      {formatCoordinate(selectedDestination.coordinates.latitude)},{' '}
                      {formatCoordinate(selectedDestination.coordinates.longitude)}
                    </Text>
                  </View>
                  <View style={styles.detailBox}>
                    <Text style={styles.detailLabel}>Distância</Text>
                    <Text style={styles.detailValue}>{distance ? `${Math.round(distance)} km` : 'Ative o GPS'}</Text>
                  </View>
                </View>

                <Text style={styles.panelTitle}>Pontos de interesse</Text>
                <View style={styles.tagRow}>
                  {selectedDestination.highlights.map((highlight) => (
                    <Text key={highlight} style={styles.tag}>
                      {highlight}
                    </Text>
                  ))}
                </View>

                <Text style={styles.panelTitle}>Roteiro sugerido</Text>
                {selectedDestination.itinerary.map((step, index) => (
                  <View key={step} style={styles.itineraryLine}>
                    <Text style={styles.itineraryNumber}>{index + 1}</Text>
                    <Text style={styles.itineraryText}>{step}</Text>
                  </View>
                ))}

                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.primaryButton} onPress={() => prepareRouteFor(selectedDestination)}>
                    <Text style={styles.primaryButtonText}>Cadastrar rota</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.secondaryButtonWide} onPress={requestCurrentLocation}>
                    <Text style={styles.secondaryButtonText}>Atualizar GPS</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f4ed" />
      <View style={styles.appShell}>
        <View style={styles.appHeader}>
          <View>
            <Text style={styles.appName}>Rota Viva</Text>
            <Text style={styles.appSubtitle}>Projeto Extra • DDM 2026.1</Text>
          </View>
          <TouchableOpacity style={styles.headerGpsButton} onPress={requestCurrentLocation} disabled={locationLoading}>
            <Text style={styles.headerGpsText}>{locationLoading ? 'GPS...' : 'GPS'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabBar}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabButton, activeTab === tab.id && styles.tabButtonActive]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.body}>
          {activeTab === 'destinos' ? renderDestinations() : null}
          {activeTab === 'rotas' ? renderRoutes() : null}
          {activeTab === 'sensor' ? renderSensor() : null}
        </View>
      </View>
      {renderDestinationModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f4ed',
    paddingTop: Platform.OS === 'android' ? 28 : 0,
  },
  appShell: {
    flex: 1,
  },
  appHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
  },
  appName: {
    color: '#16352f',
    fontSize: 28,
    fontWeight: '900',
  },
  appSubtitle: {
    color: '#68756f',
    fontSize: 13,
    marginTop: 2,
  },
  headerGpsButton: {
    alignItems: 'center',
    backgroundColor: '#173d35',
    borderRadius: 8,
    minWidth: 64,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  headerGpsText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  tabBar: {
    backgroundColor: '#ece3d6',
    borderRadius: 8,
    flexDirection: 'row',
    marginHorizontal: 20,
    padding: 4,
  },
  tabButton: {
    alignItems: 'center',
    borderRadius: 6,
    flex: 1,
    paddingVertical: 10,
  },
  tabButtonActive: {
    backgroundColor: '#ffffff',
  },
  tabText: {
    color: '#62716a',
    fontSize: 13,
    fontWeight: '700',
  },
  tabTextActive: {
    color: '#16352f',
  },
  body: {
    flex: 1,
  },
  keyboardScreen: {
    flex: 1,
  },
  screenContent: {
    padding: 20,
    paddingBottom: 36,
  },
  hero: {
    backgroundColor: '#173d35',
    borderRadius: 8,
    padding: 22,
  },
  heroKicker: {
    color: '#f6c177',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: 38,
    fontWeight: '900',
    marginTop: 6,
  },
  heroCopy: {
    color: '#dce8e2',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  statBox: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 8,
    flex: 1,
    padding: 12,
  },
  statNumber: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
  },
  statLabel: {
    color: '#dce8e2',
    fontSize: 12,
    marginTop: 2,
  },
  gpsCard: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#eadfce',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
    padding: 16,
  },
  gpsTextBlock: {
    flex: 1,
  },
  sectionEyebrow: {
    color: '#d95d39',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  gpsTitle: {
    color: '#1f322d',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 4,
  },
  gpsSubtitle: {
    color: '#68756f',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  smallActionButton: {
    alignItems: 'center',
    backgroundColor: '#f6c177',
    borderRadius: 8,
    minWidth: 82,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  smallActionText: {
    color: '#173d35',
    fontSize: 12,
    fontWeight: '900',
  },
  sectionTitle: {
    color: '#173d35',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 12,
    marginTop: 24,
  },
  destinationCard: {
    backgroundColor: '#ffffff',
    borderColor: '#eadfce',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  destinationImage: {
    backgroundColor: '#dde4df',
    height: 174,
    width: '100%',
  },
  destinationBody: {
    padding: 16,
  },
  cardTopLine: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  pill: {
    borderRadius: 6,
    fontSize: 11,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 6,
    textTransform: 'uppercase',
  },
  distanceText: {
    color: '#68756f',
    fontSize: 12,
    fontWeight: '800',
  },
  destinationName: {
    color: '#173d35',
    fontSize: 21,
    fontWeight: '900',
  },
  destinationMeta: {
    color: '#68756f',
    fontSize: 13,
    marginTop: 4,
  },
  destinationDescription: {
    color: '#394842',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  tag: {
    backgroundColor: '#f1ede5',
    borderRadius: 6,
    color: '#4e5d56',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionHeaderCompact: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  counterBadge: {
    backgroundColor: '#173d35',
    borderRadius: 6,
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  formPanel: {
    backgroundColor: '#ffffff',
    borderColor: '#eadfce',
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  inputLabel: {
    color: '#173d35',
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#f8f4ed',
    borderColor: '#e4d8c8',
    borderRadius: 8,
    borderWidth: 1,
    color: '#182f2a',
    fontSize: 15,
    minHeight: 48,
    paddingHorizontal: 12,
  },
  textArea: {
    minHeight: 96,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  chipRow: {
    gap: 8,
    paddingRight: 10,
  },
  choiceChip: {
    borderColor: '#e3d6c6',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  choiceChipText: {
    color: '#5d6a64',
    fontSize: 12,
    fontWeight: '800',
  },
  twoColumn: {
    flexDirection: 'row',
    gap: 10,
  },
  formColumn: {
    flex: 1,
  },
  readOnlyInput: {
    backgroundColor: '#efe7dc',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 12,
  },
  readOnlyText: {
    color: '#52605a',
    fontSize: 14,
    fontWeight: '800',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#173d35',
    borderRadius: 8,
    marginTop: 16,
    paddingVertical: 14,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
  },
  stopButton: {
    backgroundColor: '#d95d39',
  },
  mediaPanel: {
    backgroundColor: '#ffffff',
    borderColor: '#eadfce',
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 16,
    padding: 16,
  },
  panelTitle: {
    color: '#173d35',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 4,
  },
  mediaActions: {
    flexDirection: 'row',
    gap: 8,
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: '#f6c177',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  secondaryButtonText: {
    color: '#173d35',
    fontSize: 12,
    fontWeight: '900',
  },
  secondaryButtonWide: {
    alignItems: 'center',
    backgroundColor: '#f6c177',
    borderRadius: 8,
    marginTop: 10,
    paddingVertical: 14,
  },
  mediaStrip: {
    gap: 12,
    paddingTop: 14,
  },
  mediaThumbWrapper: {
    width: 148,
  },
  mediaThumb: {
    backgroundColor: '#dde4df',
    borderRadius: 8,
    height: 104,
    width: 148,
  },
  mediaCaption: {
    color: '#68756f',
    fontSize: 12,
    marginTop: 6,
  },
  routeCard: {
    backgroundColor: '#ffffff',
    borderColor: '#eadfce',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    padding: 16,
  },
  routeCardTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deleteText: {
    color: '#d95d39',
    fontSize: 12,
    fontWeight: '900',
  },
  routeTitle: {
    color: '#173d35',
    fontSize: 19,
    fontWeight: '900',
    marginTop: 10,
  },
  routeNotes: {
    color: '#394842',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
  },
  routeGps: {
    color: '#457b9d',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 10,
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#eadfce',
    borderRadius: 8,
    borderWidth: 1,
    padding: 24,
  },
  emptyTitle: {
    color: '#173d35',
    fontSize: 17,
    fontWeight: '900',
  },
  emptyText: {
    color: '#68756f',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  sensorPanel: {
    backgroundColor: '#ffffff',
    borderColor: '#eadfce',
    borderRadius: 8,
    borderWidth: 1,
    padding: 20,
  },
  sensorTitle: {
    color: '#173d35',
    fontSize: 26,
    fontWeight: '900',
    marginTop: 4,
  },
  sensorStatus: {
    color: '#457b9d',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 12,
  },
  motionMeter: {
    backgroundColor: '#efe7dc',
    borderRadius: 8,
    height: 18,
    marginTop: 16,
    overflow: 'hidden',
  },
  motionFill: {
    backgroundColor: '#2a9d8f',
    borderRadius: 8,
    height: '100%',
  },
  axisGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  axisBox: {
    backgroundColor: '#f8f4ed',
    borderRadius: 8,
    flex: 1,
    padding: 14,
  },
  axisLabel: {
    color: '#68756f',
    fontSize: 12,
    fontWeight: '900',
  },
  axisValue: {
    color: '#173d35',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 4,
  },
  infoBand: {
    backgroundColor: '#ddefff',
    borderRadius: 8,
    marginTop: 16,
    padding: 18,
  },
  infoText: {
    color: '#394842',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  modalOverlay: {
    backgroundColor: 'rgba(21, 31, 28, 0.48)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    maxHeight: '92%',
    overflow: 'hidden',
  },
  modalImage: {
    backgroundColor: '#dde4df',
    height: 228,
    width: '100%',
  },
  modalContent: {
    padding: 20,
  },
  closeText: {
    color: '#d95d39',
    fontSize: 13,
    fontWeight: '900',
  },
  modalTitle: {
    color: '#173d35',
    fontSize: 29,
    fontWeight: '900',
    marginTop: 6,
  },
  modalDescription: {
    color: '#394842',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 14,
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
    marginTop: 18,
  },
  detailBox: {
    backgroundColor: '#f8f4ed',
    borderRadius: 8,
    flexBasis: '48%',
    flexGrow: 1,
    padding: 12,
  },
  detailLabel: {
    color: '#68756f',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  detailValue: {
    color: '#173d35',
    fontSize: 14,
    fontWeight: '900',
    marginTop: 6,
  },
  itineraryLine: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  itineraryNumber: {
    backgroundColor: '#173d35',
    borderRadius: 6,
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  itineraryText: {
    color: '#394842',
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
  },
  modalActions: {
    marginTop: 10,
  },
});
