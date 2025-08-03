export interface User {
  userId: string
  username: string
  email: string
  phoneNumber?: string
  password: string
  createdAt: string
  updatedAt: string
}

export interface Airline {
  airlineCode: string
  dotCode?: number
  name: string
}

export interface Airport {
  airportCode: string
  name: string
  city: string
  state?: string
  locationLat?: number
  locationLng?: number
  timeZone?: string
  zipCode?: string
}

export interface Flight {
  flightId: string
  airlineCode: string
  flightNumber: number
  originAirport: string
  destAirport: string
  scheduledDepartureTime: string
  scheduledArrivalTime: string
  elapsedTime?: number
  distance?: number
}

export interface FlightStatus {
  statusId: string
  flightId: string
  flightDate: string
  actualDepartureTime?: string
  actualArrivalTime?: string
  departureDelay?: number
  arrivalDelay?: number
  taxiOut?: number
  taxiIn?: number
  actualElapsedTime?: number
  airTime?: number
  cancelled: boolean
  cancellationCode?: string
  diverted: boolean
  carrierDelay?: number
  weatherDelay?: number
  nasDelay?: number
  securityDelay?: number
  lateAircraftDelay?: number
  flight: Flight
}

export interface DelayPrediction {
  predictionId: string
  flightId: string
  predictionTime: string
  predictedDepartureDelay?: number
  predictedArrivalDelay?: number
  notificationSent: boolean
  predictionReason?: string
  flight: Flight
}

export interface WeatherEvent {
  eventId: string
  airportCode: string
  type: string
  severity?: string
  startTime: string
  endTime: string
  precipitation?: number
  locationLat?: number
  locationLng?: number
  city?: string
  country?: string
  zipCode?: string
  airport: Airport
}

export interface UserAlert {
  alertId: string
  userId: string
  emailAlert: boolean
  smsAlert: boolean
  delayThreshold?: number
  createdAt: string
  user: User
}
