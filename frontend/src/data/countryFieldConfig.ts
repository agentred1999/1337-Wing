// Per-country address field labels, placeholders, and layout hints.
// Falls back to DEFAULT_CONFIG for any country not listed explicitly.
// Countries with a `states` array render a <select> in the shipping form;
// countries with showState=true but no `states` array fall back to free text.

export interface CountryConfig {
  stateLabel: string;
  showState: boolean;
  zipLabel: string;
  zipPlaceholder: string;
  states?: string[];
}

export const DEFAULT_CONFIG: CountryConfig = {
  stateLabel: 'State / Province',
  showState: true,
  zipLabel: 'Postal Code',
  zipPlaceholder: '',
};

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'District of Columbia', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois',
  'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts',
  'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
  'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming',
];

const CANADA_PROVINCES = [
  'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador',
  'Northwest Territories', 'Nova Scotia', 'Nunavut', 'Ontario', 'Prince Edward Island',
  'Quebec', 'Saskatchewan', 'Yukon',
];

const MEXICO_STATES = [
  'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas',
  'Chihuahua', 'Ciudad de México', 'Coahuila', 'Colima', 'Durango', 'Guanajuato',
  'Guerrero', 'Hidalgo', 'Jalisco', 'México', 'Michoacán', 'Morelos', 'Nayarit',
  'Nuevo León', 'Oaxaca', 'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí',
  'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas',
];

const AUSTRALIA_STATES = [
  'Australian Capital Territory', 'New South Wales', 'Northern Territory', 'Queensland',
  'South Australia', 'Tasmania', 'Victoria', 'Western Australia',
];

const JAPAN_PREFECTURES = [
  'Hokkaido', 'Aomori', 'Iwate', 'Miyagi', 'Akita', 'Yamagata', 'Fukushima', 'Ibaraki',
  'Tochigi', 'Gunma', 'Saitama', 'Chiba', 'Tokyo', 'Kanagawa', 'Niigata', 'Toyama',
  'Ishikawa', 'Fukui', 'Yamanashi', 'Nagano', 'Gifu', 'Shizuoka', 'Aichi', 'Mie',
  'Shiga', 'Kyoto', 'Osaka', 'Hyogo', 'Nara', 'Wakayama', 'Tottori', 'Shimane',
  'Okayama', 'Hiroshima', 'Yamaguchi', 'Tokushima', 'Kagawa', 'Ehime', 'Kochi',
  'Fukuoka', 'Saga', 'Nagasaki', 'Kumamoto', 'Oita', 'Miyazaki', 'Kagoshima', 'Okinawa',
];

const INDIA_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir', 'Ladakh',
];

const BRAZIL_STATES = [
  'Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal',
  'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul',
  'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí', 'Rio de Janeiro',
  'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia', 'Roraima', 'Santa Catarina',
  'São Paulo', 'Sergipe', 'Tocantins',
];

const ARGENTINA_PROVINCES = [
  'Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes', 'Entre Ríos',
  'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 'Neuquén', 'Río Negro',
  'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 'Santa Fe', 'Santiago del Estero',
  'Tierra del Fuego', 'Tucumán', 'Ciudad Autónoma de Buenos Aires',
];

const SOUTH_AFRICA_PROVINCES = [
  'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo', 'Mpumalanga',
  'Northern Cape', 'North West', 'Western Cape',
];

const SOUTH_KOREA_PROVINCES = [
  'Seoul', 'Busan', 'Daegu', 'Incheon', 'Gwangju', 'Daejeon', 'Ulsan', 'Sejong',
  'Gyeonggi', 'Gangwon', 'North Chungcheong', 'South Chungcheong', 'North Jeolla',
  'South Jeolla', 'North Gyeongsang', 'South Gyeongsang', 'Jeju',
];

const CHINA_PROVINCES = [
  'Beijing', 'Tianjin', 'Hebei', 'Shanxi', 'Inner Mongolia', 'Liaoning', 'Jilin',
  'Heilongjiang', 'Shanghai', 'Jiangsu', 'Zhejiang', 'Anhui', 'Fujian', 'Jiangxi',
  'Shandong', 'Henan', 'Hubei', 'Hunan', 'Guangdong', 'Guangxi', 'Hainan', 'Chongqing',
  'Sichuan', 'Guizhou', 'Yunnan', 'Tibet', 'Shaanxi', 'Gansu', 'Qinghai', 'Ningxia',
  'Xinjiang', 'Hong Kong', 'Macau', 'Taiwan',
];

export const COUNTRY_FIELD_CONFIG: Record<string, CountryConfig> = {
  'United States':  { stateLabel: 'State',              showState: true,  zipLabel: 'ZIP Code',      zipPlaceholder: '90210',    states: US_STATES },
  'Canada':         { stateLabel: 'Province',            showState: true,  zipLabel: 'Postal Code',   zipPlaceholder: 'A1A 1A1',  states: CANADA_PROVINCES },
  'Mexico':         { stateLabel: 'State',                showState: true,  zipLabel: 'Postal Code',   zipPlaceholder: '01000',    states: MEXICO_STATES },
  'United Kingdom': { stateLabel: 'County',               showState: false, zipLabel: 'Postcode',      zipPlaceholder: 'SW1A 1AA' },
  'Ireland':        { stateLabel: 'County',               showState: false, zipLabel: 'Eircode',       zipPlaceholder: 'D01 F5P2' },
  'Australia':      { stateLabel: 'State / Territory',    showState: true,  zipLabel: 'Postcode',      zipPlaceholder: '2000',     states: AUSTRALIA_STATES },
  'New Zealand':    { stateLabel: 'Region',                showState: false, zipLabel: 'Postcode',      zipPlaceholder: '1010' },
  'Germany':        { stateLabel: 'State (Bundesland)',   showState: false, zipLabel: 'Postal Code',   zipPlaceholder: '10115' },
  'France':         { stateLabel: 'Region',                showState: false, zipLabel: 'Postal Code',   zipPlaceholder: '75001' },
  'Spain':          { stateLabel: 'Province',              showState: false, zipLabel: 'Postal Code',   zipPlaceholder: '28001' },
  'Italy':          { stateLabel: 'Province',              showState: false, zipLabel: 'Postal Code',   zipPlaceholder: '00100' },
  'Netherlands':    { stateLabel: 'Province',              showState: false, zipLabel: 'Postal Code',   zipPlaceholder: '1011 AB' },
  'Belgium':        { stateLabel: 'Region',                showState: false, zipLabel: 'Postal Code',   zipPlaceholder: '1000' },
  'Switzerland':    { stateLabel: 'Canton',                showState: false, zipLabel: 'Postal Code',   zipPlaceholder: '8000' },
  'Austria':        { stateLabel: 'State',                 showState: false, zipLabel: 'Postal Code',   zipPlaceholder: '1010' },
  'Sweden':         { stateLabel: 'County',                showState: false, zipLabel: 'Postal Code',   zipPlaceholder: '111 22' },
  'Norway':         { stateLabel: 'County',                showState: false, zipLabel: 'Postal Code',   zipPlaceholder: '0150' },
  'Denmark':        { stateLabel: 'Region',                showState: false, zipLabel: 'Postal Code',   zipPlaceholder: '1050' },
  'Finland':        { stateLabel: 'Region',                showState: false, zipLabel: 'Postal Code',   zipPlaceholder: '00100' },
  'Poland':         { stateLabel: 'Voivodeship',           showState: false, zipLabel: 'Postal Code',   zipPlaceholder: '00-001' },
  'Portugal':       { stateLabel: 'District',              showState: false, zipLabel: 'Postal Code',   zipPlaceholder: '1000-001' },
  'Greece':         { stateLabel: 'Region',                showState: false, zipLabel: 'Postal Code',   zipPlaceholder: '104 31' },
  'Japan':          { stateLabel: 'Prefecture',            showState: true,  zipLabel: 'Postal Code',   zipPlaceholder: '100-0001', states: JAPAN_PREFECTURES },
  'South Korea':    { stateLabel: 'Province',              showState: true,  zipLabel: 'Postal Code',   zipPlaceholder: '03187',    states: SOUTH_KOREA_PROVINCES },
  'China':          { stateLabel: 'Province',              showState: true,  zipLabel: 'Postal Code',   zipPlaceholder: '100000',   states: CHINA_PROVINCES },
  'India':          { stateLabel: 'State',                 showState: true,  zipLabel: 'PIN Code',      zipPlaceholder: '110001',   states: INDIA_STATES },
  'Singapore':      { stateLabel: 'Region',                showState: false, zipLabel: 'Postal Code',   zipPlaceholder: '018956' },
  'Brazil':         { stateLabel: 'State',                 showState: true,  zipLabel: 'CEP',           zipPlaceholder: '01310-100', states: BRAZIL_STATES },
  'Argentina':      { stateLabel: 'Province',              showState: true,  zipLabel: 'Postal Code',   zipPlaceholder: 'C1002',    states: ARGENTINA_PROVINCES },
  'Chile':          { stateLabel: 'Region',                showState: false, zipLabel: 'Postal Code',   zipPlaceholder: '8320000' },
  'South Africa':   { stateLabel: 'Province',              showState: true,  zipLabel: 'Postal Code',   zipPlaceholder: '0001',     states: SOUTH_AFRICA_PROVINCES },
};

export function getCountryConfig(country: string): CountryConfig {
  return COUNTRY_FIELD_CONFIG[country] || DEFAULT_CONFIG;
}
