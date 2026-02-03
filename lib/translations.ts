export type Language = 'es' | 'en' | 'ko'

export interface Translations {
  // Header
  cart: string
  
  // Hero
  heroTitle: string
  heroSubtitle: string
  exploreDesigns: string
  
  // Navigation
  home: string
  search: string
  wishlist: string
  profile: string
  
  // Products
  mostPopular: string
  favorite: string
  limitedEdition: string
  classic: string
  newProduct: string
  trending: string
  popular: string
  exclusive: string
  winterCollection: string
  ballerina: string
  lightyear: string
  combat: string
  
  // Product descriptions
  productDesc: string
  productDescHigh: string
  productDescWinter: string
  productDescBallerina: string
  productDescLightyear: string
  productDescCombat: string
  
  // Product names
  productName1: string
  productName2: string
  productName3: string
  productName4: string
  productName5: string
  productName6: string
  productName7: string
  productName8: string
  productName9: string
  productName10: string
  productName11: string
  productName12: string
  productName13: string
  productName14: string
  productName15: string
  productName16: string
  productName17: string
  productName18: string
  productName19: string
  productName20: string
  productName21: string
  
  // Video section
  videoTitle: string
  videoTitleHighlight: string
  videoDesc: string
  
  // Shop section
  bestSellers: string
  bestSellersDesc: string
  viewCollection: string
  quickView: string
  add: string
  
  // Cart
  shoppingCart: string
  emptyCart: string
  subtotal: string
  total: string
  buyWhatsApp: string
  remove: string
  
  // Wishlist
  myWishlist: string
  emptyWishlist: string
  emptyWishlistDesc: string
  addAll: string
  addToCart: string
  removeItem: string
  
  // Search
  searchProducts: string
  typeToSearch: string
  resultsFor: string
  noProductsFound: string
  cancel: string
  
  // Profile
  myProfile: string
  welcomeVincero: string
  loginAccess: string
  myOrders: string
  viewHistory: string
  support: string
  contactWhatsApp: string
  login: string
  createAccount: string
  
  // Size selector
  selectSize: string
  availableSizes: string
  addSize: string
  selectSizeFirst: string
  
  // Checkout
  completeData: string
  fullName: string
  phoneNumber: string
  orderSummary: string
  sendOrderWhatsApp: string
  
  // Product detail
  productDetails: string
  description: string
  details: string
  color: string
  availableSizesLabel: string
  material: string
  warranty: string
  warrantyValue: string
  
  // Auth extended
  register: string
  email: string
  password: string
  confirmPassword: string
  forgotPassword: string
  noAccount: string
  hasAccount: string
  loginSuccess: string
  registerSuccess: string
  logout: string
  myAccount: string
  orderHistory: string
  noOrders: string
  orderDate: string
  orderStatus: string
  orderTotal: string
  statusPending: string
  statusConfirmed: string
  statusShipped: string
  statusDelivered: string
  statusCancelled: string
  welcomeBack: string
  loginToContinue: string
  joinUs: string
  
  // Collections
  sportCollection: string
  highCollection: string
  winterCollectionName: string
  ballerinaCollection: string
  multicolorCollection: string
  styleComfort: string
  newSportCollection: string
  winterStyle: string
  
  // Testimonials
  testimonialTitle: string
  testimonialTitleHighlight: string
  testimonialDesc: string
  
  // Testimonial content
  testimonial1Name: string
  testimonial1Role: string
  testimonial1Content: string
  testimonial2Name: string
  testimonial2Role: string
  testimonial2Content: string
  testimonial3Name: string
  testimonial3Role: string
  testimonial3Content: string
  
  // Features
  whyChoose: string
  whyChooseHighlight: string
  whyChooseDesc: string
  qualityGuarantee: string
  qualityGuaranteeDesc: string
  innovativeDesign: string
  innovativeDesignDesc: string
  totalComfort: string
  totalComfortDesc: string
  
  // Footer
  footerTagline: string
  stores: string
  contact: string
  
  // Philosophy section
  aboutUs: string
  philosophySubtitle: string
  aboutProduct: string
  aboutProductDesc: string
  ourValues: string
  valueCare: string
  valueCareDesc: string
  valueInnovation: string
  valueInnovationDesc: string
  valueCreativity: string
  valueCreativityDesc: string
  valueCommitment: string
  valueCommitmentDesc: string
  valueInclusion: string
  valueInclusionDesc: string
  ourMission: string
  missionContent: string
  ourVision: string
  visionContent: string
  
  // Shipping info
  freeShippingInfo: string
  minPurchaseShipping: string
  
  // Checkout form
  checkout: string
  name: string
  phone: string
  continueWhatsApp: string
  
  // Menu
  catalog: string
  seasonNormal: string
  seasonHigh: string
  seasonBallerina: string
  seasonMulticolor: string
  seasonLightyear: string
  selectSeason: string
  seasonNormalDesc: string
  seasonHighDesc: string
  seasonBallerinaDesc: string
  seasonMulticolorDesc: string
  seasonLightyearDesc: string
  ourProcess: string
}

export const translations: Record<Language, Translations> = {
  es: {
    // Header
    cart: 'Carrito',
    
    // Hero
    heroTitle: 'VINCERO',
    heroSubtitle: 'First Steps',
    exploreDesigns: 'EXPLORAR DISEÑOS',
    
    // Navigation
    home: 'Inicio',
    search: 'Buscar',
    wishlist: 'Favoritos',
    profile: 'Perfil',
    
    // Products
    mostPopular: 'Más Popular',
    favorite: 'Favorito',
    limitedEdition: 'Edición Limitada',
    classic: 'Clásico',
    newProduct: 'Nuevo',
    trending: 'Tendencia',
    popular: 'Popular',
    exclusive: 'Exclusivo',
    winterCollection: 'Colección Otoño/Invierno',
    ballerina: 'Balerina',
    lightyear: 'Lightyear',
    combat: 'Combat',
    
    // Product descriptions
    productDesc: 'Calzado deportivo-casual fabricado en textil para buena transpiración y flexibilidad. Interior textil suave al contacto con la piel. Suela de PVC con excelente tracción y durabilidad. Diseño moderno y funcional. Tallas 13mx a 17mx.',
    productDescHigh: 'Calzado deportivo alto fabricado en textil para buena transpiración y flexibilidad. Interior textil suave al contacto con la piel. Suela de PVC con excelente tracción y durabilidad. Diseño moderno y funcional. Tallas 17mx a 21mx.',
    productDescWinter: 'Calzado deportivo de temporada otoño/invierno fabricado en textil para buena transpiración y flexibilidad. Interior textil suave al contacto con la piel. Suela de PVC con excelente tracción y durabilidad. Diseño moderno y funcional. Tallas 13mx a 17mx.',
    productDescBallerina: 'Calzado estilo balerina fabricado en textil suave y flexible. Interior acolchado para máxima comodidad. Suela de PVC con excelente tracción. Diseño elegante y femenino perfecto para cualquier ocasión. Tallas 13mx a 17mx.',
    productDescLightyear: 'Calzado deportivo inspirado en aventuras espaciales, fabricado en textil resistente y flexible. Interior acolchado para máximo confort. Suela de PVC con excelente tracción y durabilidad. Diseño moderno y dinámico perfecto para pequeños exploradores. Tallas 13mx a 17mx.',
    productDescCombat: 'Tenis deportivo alto estilo Combat fabricado en textil resistente y transpirable. Diseño táctico moderno con detalles reforzados. Interior acolchado para máximo confort. Suela de PVC con excelente tracción y durabilidad. Perfecto para aventuras urbanas. Tallas 17mx a 21mx.',
    
    // Product names
    productName1: 'Tenis Deportivo Infantil ITALIA/CARAMEL',
    productName2: 'Tenis Deportivo Infantil ROSA B./ BLANCO',
    productName3: 'Tenis Deportivo Infantil OXFORD /PLATA',
    productName4: 'Tenis Deportivo Infantil BLANCO/ NEGRO',
    productName5: 'Tenis Deportivo Alto Infantil BLANCO',
    productName6: 'Tenis Deportivo Alto Infantil CARAMEL',
    productName7: 'Tenis Deportivo Alto Infantil MARINO',
    productName8: 'Tenis Deportivo Alto Infantil NEGRO',
    productName9: 'Tenis Deportivo Infantil MULTICOLOR',
    productName10: 'Tenis Balerina Infantil ROSA',
    productName11: 'Tenis Balerina Infantil NEGRO/BLANCO',
    productName12: 'Tenis Balerina Infantil ROJO',
    productName13: 'Tenis Balerina Infantil NEGRO',
    productName14: 'Tenis Deportivo Alto Infantil OXFORD',
    productName15: 'Tenis Lightyear Infantil NEGRO/BLANCO',
    productName16: 'Tenis Lightyear Infantil V. BANDERA/BLANCO',
    productName17: 'Tenis Lightyear Infantil AZUL/BLANCO',
    productName18: 'Tenis Lightyear Infantil ROSA/BLANCO',
    productName19: 'Tenis Combat Alto BLANCO',
    productName20: 'Tenis Combat Alto CARAMEL',
    productName21: 'Tenis Combat Alto OXFORD',
    
    // Video section
    videoTitle: 'Mira Nuestros',
    videoTitleHighlight: 'Tenis en Acción',
    videoDesc: 'Descubre la calidad y estilo de nuestros tenis deportivos infantiles en este video.',
    
    // Shop section
    bestSellers: 'Más Vendidos',
    bestSellersDesc: 'Los favoritos de nuestra comunidad. Descubre por qué son tan populares.',
    viewCollection: 'Ver Toda la Colección',
    quickView: 'Vista Rápida',
    add: 'Agregar',
    
    // Cart
    shoppingCart: 'Carrito de Compras',
    emptyCart: 'Tu carrito está vacío',
    subtotal: 'Subtotal',
    total: 'Total',
    buyWhatsApp: 'Comprar por WhatsApp',
    remove: 'Eliminar',
    
    // Wishlist
    myWishlist: 'Mi Wishlist',
    emptyWishlist: 'Tu wishlist está vacía',
    emptyWishlistDesc: 'Agrega productos que te gusten para verlos aquí',
    addAll: 'Agregar Todo al Carrito',
    addToCart: 'Agregar al Carrito',
    removeItem: 'Quitar',
    
    // Search
    searchProducts: 'Buscar productos...',
    typeToSearch: 'Escribe para buscar productos',
    resultsFor: 'Resultados para',
    noProductsFound: 'No se encontraron productos',
    cancel: 'Cancelar',
    
    // Profile
    myProfile: 'Mi Perfil',
    welcomeVincero: 'Bienvenido a Vincero',
    loginAccess: 'Inicia sesión para acceder a tu perfil',
    myOrders: 'Mis Pedidos',
    viewHistory: 'Ver historial de compras',
    support: 'Soporte',
    contactWhatsApp: 'Contáctanos por WhatsApp',
    login: 'Iniciar Sesión',
    createAccount: 'Crear Cuenta',
    
    // Size selector
    selectSize: 'Selecciona tu Talla',
    availableSizes: 'Tallas disponibles:',
    addSize: 'Agregar Talla',
    selectSizeFirst: 'Selecciona una Talla',
    
    // Checkout
    completeData: 'Completa tus Datos',
    fullName: 'Nombre Completo',
    phoneNumber: 'Número de Teléfono',
    orderSummary: 'Resumen del Pedido',
    sendOrderWhatsApp: 'Enviar Pedido por WhatsApp',
    
    // Product detail
    productDetails: 'Detalles del Producto',
    description: 'Descripción',
    details: 'Detalles',
    color: 'Color',
    availableSizesLabel: 'Tallas disponibles',
    material: 'Material',
    warranty: 'Garantía',
    warrantyValue: '30 días',
    
    // Auth extended
    register: 'Registrarse',
    email: 'Correo electrónico',
    password: 'Contraseña',
    confirmPassword: 'Confirmar contraseña',
    forgotPassword: '¿Olvidaste tu contraseña?',
    noAccount: '¿No tienes cuenta?',
    hasAccount: '¿Ya tienes cuenta?',
    loginSuccess: '¡Bienvenido de vuelta!',
    registerSuccess: '¡Cuenta creada exitosamente!',
    logout: 'Cerrar sesión',
    myAccount: 'Mi Cuenta',
    orderHistory: 'Historial de pedidos',
    noOrders: 'Aún no tienes pedidos',
    orderDate: 'Fecha',
    orderStatus: 'Estado',
    orderTotal: 'Total',
    statusPending: 'Pendiente',
    statusConfirmed: 'Confirmado',
    statusShipped: 'Enviado',
    statusDelivered: 'Entregado',
    statusCancelled: 'Cancelado',
    welcomeBack: '¡Bienvenido de vuelta!',
    loginToContinue: 'Inicia sesión para continuar',
    joinUs: 'Únete a VINCERO',
    
    // Collections
    sportCollection: 'Colección Low by VINCERO',
    highCollection: 'Colección High by VINCERO',
    winterCollectionName: 'Colección Otoño/Invierno',
    ballerinaCollection: 'Colección Balerina by VINCERO',
    multicolorCollection: 'Colección Multicolor by VINCERO',
    styleComfort: 'Estilo y comodidad',
    newSportCollection: 'Nueva colección deportiva',
    winterStyle: 'Estilo para la temporada',
    
    // Testimonials
    testimonialTitle: 'Lo que dicen nuestros',
    testimonialTitleHighlight: 'clientes',
    testimonialDesc: 'Padres satisfechos que confían en Vincero para el calzado de sus hijos.',
    
    // Testimonial content
    testimonial1Name: 'Laura Mendoza',
    testimonial1Role: 'Mamá verificada',
    testimonial1Content: 'Excelente calidad, muy cómodos y duraderos. Ya van varios meses de uso diario y siguen como nuevos. El diseño es muy bonito y a mi pequeño le encantan.',
    testimonial2Name: 'Roberto García',
    testimonial2Role: 'Papá verificado',
    testimonial2Content: 'Muy buena compra. La suela es resistente, el material transpira bien y son fáciles de poner. Los recomiendo ampliamente para el día a día.',
    testimonial3Name: '',
    testimonial3Role: '',
    testimonial3Content: '',
    
    // Features
    whyChoose: 'Por qué elegir',
    whyChooseHighlight: 'Vincero',
    whyChooseDesc: 'Calidad excepcional en cada detalle. Diseñado para quienes buscan lo mejor.',
    qualityGuarantee: 'Garantía de Calidad',
    qualityGuaranteeDesc: 'Cada par está respaldado por nuestra garantía de 30 días. Calidad que perdura.',
    innovativeDesign: 'Diseño Innovador',
    innovativeDesignDesc: 'Diseños modernos y coloridos que a los niños les encantan.',
    totalComfort: 'Comodidad Total',
    totalComfortDesc: 'Suelas acolchadas perfectas para jugar todo el día.',
    
    // Footer
    footerTagline: 'Calzado para peques con estilo',
    stores: 'Tiendas',
    contact: 'Contacto',
    
    // Philosophy section
    aboutUs: 'Nosotros',
    philosophySubtitle: 'Organizacional',
    aboutProduct: 'Nuestro Calzado',
    aboutProductDesc: 'Nuestro producto se caracteriza por ser calzado deportivo – casual, fabricado en textil, lo que garantiza una buena transpiración y flexibilidad, ideal para actividades deportivas y el uso diario. Su interior también es de textil, ofreciendo una sensación suave y agradable al contacto con la piel. La suela de PVC proporciona una excelente tracción y durabilidad, permitiendo que los niños se desplacen con confianza en diversas superficies. Con un diseño moderno y funcional, estos tenis son perfectos para acompañar a los más pequeños en sus aventuras cotidianas.',
    ourValues: 'Nuestros Valores',
    valueCare: 'Cuidado',
    valueCareDesc: 'Cada par está diseñado para la seguridad de los niños.',
    valueInnovation: 'Innovación Constante',
    valueInnovationDesc: 'Buscamos, diseñamos y creamos con la más alta calidad de materiales para el proceso del calzado.',
    valueCreativity: 'Creatividad',
    valueCreativityDesc: 'Lo exclusivo está en los detalles.',
    valueCommitment: 'Compromiso',
    valueCommitmentDesc: '"Honramos" el trabajo y la confianza para la comodidad de cada familia.',
    valueInclusion: 'Inclusión',
    valueInclusionDesc: 'Promoviendo que cada diseño tenga un sentido de pertenencia.',
    ourMission: 'Nuestra Misión',
    missionContent: 'Acompañar los pasos más importantes de la infancia con calzado seguro, cómodo y lleno de estilo. En Vincero elaboramos zapatos que dan confianza a los padres y libertad a los niños. Elevar el calzado infantil a un nivel accesible, creando piezas únicas que combinan diseño exclusivo, confort superior y seguridad en cada paso. Promoviendo la autonomía desde temprana edad. En Vincero transformamos la innovación y el trabajo manual en experiencias que acompañan la infancia con estilo y calidad impecable.',
    ourVision: 'Nuestra Visión',
    visionContent: 'Queremos que Vincero sea la primera elección de los padres que buscan distinción y bienestar para sus hijos, porque saben que con nosotros encuentran un calzado diseñado y elaborado con estándares de calidad para el bienestar de los pequeños. Queremos que Vincero sea un referente nacional y una fuente de inspiración para la evolución del calzado infantil.',
    
    // Shipping info
    freeShippingInfo: '¡Envío gratis en tu compra!',
    minPurchaseShipping: 'Agrega $800 MXN o más para envío gratis',
    
    // Checkout form
    checkout: 'Pagar',
    name: 'Nombre',
    phone: 'Teléfono',
    continueWhatsApp: 'Continuar por WhatsApp',
    
    // Menu
    catalog: 'Catálogo',
    seasonNormal: 'Colección Low by VINCERO',
    seasonHigh: 'Colección High by VINCERO',
    seasonBallerina: 'Colección Balerina by VINCERO',
    seasonMulticolor: 'Colección Multicolor by VINCERO',
    seasonLightyear: 'Colección LIGHTYEAR by VINCERO',
    selectSeason: 'Selecciona una colección',
    seasonNormalDesc: 'Colección clásica para el día a día',
    seasonHighDesc: 'Colección premium de edición especial',
    seasonBallerinaDesc: 'Estilo elegante y femenino',
    seasonMulticolorDesc: 'Diseño vibrante y único',
    seasonLightyearDesc: 'Aventura al infinito y más allá',
    ourProcess: 'Nuestro Proceso',
  },
  
  en: {
    // Header
    cart: 'Cart',
    
    // Hero
    heroTitle: 'VINCERO',
    heroSubtitle: 'First Steps',
    exploreDesigns: 'EXPLORE DESIGNS',
    
    // Navigation
    home: 'Home',
    search: 'Search',
    wishlist: 'Wishlist',
    profile: 'Profile',
    
    // Products
    mostPopular: 'Most Popular',
    favorite: 'Favorite',
    limitedEdition: 'Limited Edition',
    classic: 'Classic',
    newProduct: 'New',
    trending: 'Trending',
    popular: 'Popular',
    exclusive: 'Exclusive',
    winterCollection: 'Fall/Winter Collection',
    ballerina: 'Balerina',
    lightyear: 'Lightyear',
    combat: 'Combat',
    
    // Product descriptions
    productDesc: 'Sporty-casual footwear made of textile for excellent breathability and flexibility. Soft textile interior for skin comfort. PVC sole with great traction and durability. Modern and functional design. Sizes 13mx to 17mx.',
    productDescHigh: 'High-top sporty footwear made of textile for excellent breathability and flexibility. Soft textile interior for skin comfort. PVC sole with great traction and durability. Modern and functional design. Sizes 17mx to 21mx.',
    productDescWinter: 'Fall/winter season sporty footwear made of textile for excellent breathability and flexibility. Soft textile interior for skin comfort. PVC sole with great traction and durability. Modern and functional design. Sizes 13mx to 17mx.',
    productDescBallerina: 'Balerina-style footwear made of soft and flexible textile. Cushioned interior for maximum comfort. PVC sole with excellent traction. Elegant and feminine design perfect for any occasion. Sizes 13mx to 17mx.',
    productDescLightyear: 'Sports footwear inspired by space adventures, made of durable and flexible textile. Cushioned interior for maximum comfort. PVC sole with excellent traction and durability. Modern and dynamic design perfect for little explorers. Sizes 13mx to 17mx.',
    productDescCombat: 'High-top Combat-style sports sneakers made of durable and breathable textile. Modern tactical design with reinforced details. Cushioned interior for maximum comfort. PVC sole with excellent traction and durability. Perfect for urban adventures. Sizes 17mx to 21mx.',
    
    // Product names
    productName1: 'Kids Sport Sneakers ITALIA/CARAMEL',
    productName2: 'Kids Sport Sneakers ROSA B./ BLANCO',
    productName3: 'Kids Sport Sneakers OXFORD /PLATA',
    productName4: 'Kids Sport Sneakers BLANCO/ NEGRO',
    productName5: 'Kids High-Top Sneakers BLANCO',
    productName6: 'Kids High-Top Sneakers CARAMEL',
    productName7: 'Kids High-Top Sneakers MARINO',
    productName8: 'Kids High-Top Sneakers NEGRO',
    productName9: 'Kids Sport Sneakers MULTICOLOR',
    productName10: 'Kids Balerina Sneakers PINK',
    productName11: 'Kids Balerina Sneakers BLACK/WHITE',
    productName12: 'Kids Balerina Sneakers RED',
    productName13: 'Kids Balerina Sneakers BLACK',
    productName14: 'Kids High-Top Sneakers OXFORD',
    productName15: 'Kids Lightyear Sneakers BLACK/WHITE',
    productName16: 'Kids Lightyear Sneakers V. FLAG/WHITE',
    productName17: 'Kids Lightyear Sneakers BLUE/WHITE',
    productName18: 'Kids Lightyear Sneakers PINK/WHITE',
    productName19: 'High Combat Sneakers WHITE',
    productName20: 'High Combat Sneakers CARAMEL',
    productName21: 'High Combat Sneakers OXFORD',
    
    // Video section
    videoTitle: 'Watch Our',
    videoTitleHighlight: 'Sneakers in Action',
    videoDesc: 'Discover the quality and style of our kids sport sneakers in this video.',
    
    // Shop section
    bestSellers: 'Best Sellers',
    bestSellersDesc: 'Our community favorites. Discover why they are so popular.',
    viewCollection: 'View Full Collection',
    quickView: 'Quick View',
    add: 'Add',
    
    // Cart
    shoppingCart: 'Shopping Cart',
    emptyCart: 'Your cart is empty',
    subtotal: 'Subtotal',
    total: 'Total',
    buyWhatsApp: 'Buy via WhatsApp',
    remove: 'Remove',
    
    // Wishlist
    myWishlist: 'My Wishlist',
    emptyWishlist: 'Your wishlist is empty',
    emptyWishlistDesc: 'Add products you like to see them here',
    addAll: 'Add All to Cart',
    addToCart: 'Add to Cart',
    removeItem: 'Remove',
    
    // Search
    searchProducts: 'Search products...',
    typeToSearch: 'Type to search products',
    resultsFor: 'Results for',
    noProductsFound: 'No products found',
    cancel: 'Cancel',
    
    // Profile
    myProfile: 'My Profile',
    welcomeVincero: 'Welcome to Vincero',
    loginAccess: 'Log in to access your profile',
    myOrders: 'My Orders',
    viewHistory: 'View purchase history',
    support: 'Support',
    contactWhatsApp: 'Contact us via WhatsApp',
    login: 'Log In',
    createAccount: 'Create Account',
    
    // Size selector
    selectSize: 'Select Your Size',
    availableSizes: 'Available sizes:',
    addSize: 'Add Size',
    selectSizeFirst: 'Select a Size',
    
    // Checkout
    completeData: 'Complete Your Information',
    fullName: 'Full Name',
    phoneNumber: 'Phone Number',
    orderSummary: 'Order Summary',
    sendOrderWhatsApp: 'Send Order via WhatsApp',
    
    // Product detail
    productDetails: 'Product Details',
    description: 'Description',
    details: 'Details',
    color: 'Color',
    availableSizesLabel: 'Available sizes',
    material: 'Material',
    warranty: 'Warranty',
    warrantyValue: '30 days',
    
    // Auth extended
    register: 'Register',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm password',
    forgotPassword: 'Forgot your password?',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    loginSuccess: 'Welcome back!',
    registerSuccess: 'Account created successfully!',
    logout: 'Log out',
    myAccount: 'My Account',
    orderHistory: 'Order history',
    noOrders: 'No orders yet',
    orderDate: 'Date',
    orderStatus: 'Status',
    orderTotal: 'Total',
    statusPending: 'Pending',
    statusConfirmed: 'Confirmed',
    statusShipped: 'Shipped',
    statusDelivered: 'Delivered',
    statusCancelled: 'Cancelled',
    welcomeBack: 'Welcome back!',
    loginToContinue: 'Log in to continue',
    joinUs: 'Join VINCERO',
    
    // Collections
    sportCollection: 'Low Collection by VINCERO',
    highCollection: 'High Collection by VINCERO',
    winterCollectionName: 'Fall/Winter Collection',
    ballerinaCollection: 'Balerina Collection by VINCERO',
    multicolorCollection: 'Multicolor Collection by VINCERO',
    styleComfort: 'Style and comfort',
    newSportCollection: 'New sports collection',
    winterStyle: 'Seasonal style',
    
    // Testimonials
    testimonialTitle: 'What our',
    testimonialTitleHighlight: 'customers say',
    testimonialDesc: 'Satisfied parents who trust Vincero for their children\'s footwear.',
    
    // Testimonial content
    testimonial1Name: 'Laura Mendoza',
    testimonial1Role: 'Verified Mom',
    testimonial1Content: 'Excellent quality, very comfortable and durable. Several months of daily use and they still look like new. The design is beautiful and my little one loves them.',
    testimonial2Name: 'Roberto Garcia',
    testimonial2Role: 'Verified Dad',
    testimonial2Content: 'Great purchase. The sole is resistant, the material breathes well and they are easy to put on. I highly recommend them for everyday use.',
    testimonial3Name: '',
    testimonial3Role: '',
    testimonial3Content: '',
    
    // Features
    whyChoose: 'Why choose',
    whyChooseHighlight: 'Vincero',
    whyChooseDesc: 'Exceptional quality in every detail. Designed for those who seek the best.',
    qualityGuarantee: 'Quality Guarantee',
    qualityGuaranteeDesc: 'Each pair is backed by our 30-day warranty. Quality that lasts.',
    innovativeDesign: 'Innovative Design',
    innovativeDesignDesc: 'Modern and colorful designs that kids love.',
    totalComfort: 'Total Comfort',
    totalComfortDesc: 'Cushioned soles perfect for playing all day.',
    
    // Footer
    footerTagline: 'Stylish footwear for little ones',
    stores: 'Stores',
    contact: 'Contact',
    
    // Philosophy section
    aboutUs: 'About Us',
    philosophySubtitle: 'Philosophy',
    aboutProduct: 'Our Footwear',
    aboutProductDesc: 'Our product is characterized by being sporty-casual footwear, made of textile, which guarantees good breathability and flexibility, ideal for sports activities and daily use. Its interior is also textile, offering a soft and pleasant sensation in contact with the skin. The PVC sole provides excellent traction and durability, allowing children to move confidently on various surfaces. With a modern and functional design, these sneakers are perfect to accompany the little ones in their daily adventures.',
    ourValues: 'Our Values',
    valueCare: 'Care',
    valueCareDesc: 'Each pair is designed for children\'s safety.',
    valueInnovation: 'Constant Innovation',
    valueInnovationDesc: 'We search, design and create with the highest quality materials for the footwear process.',
    valueCreativity: 'Creativity',
    valueCreativityDesc: 'Exclusivity is in the details.',
    valueCommitment: 'Commitment',
    valueCommitmentDesc: 'We "honor" the work and trust for the comfort of each family.',
    valueInclusion: 'Inclusion',
    valueInclusionDesc: 'Promoting that each design has a sense of belonging.',
    ourMission: 'Our Mission',
    missionContent: 'To accompany the most important steps of childhood with safe, comfortable and stylish footwear. At Vincero we make shoes that give confidence to parents and freedom to children. To elevate children\'s footwear to an accessible level, creating unique pieces that combine exclusive design, superior comfort and safety in every step. Promoting autonomy from an early age. At Vincero we transform innovation and manual work into experiences that accompany childhood with style and impeccable quality.',
    ourVision: 'Our Vision',
    visionContent: 'We want Vincero to be the first choice for parents seeking distinction and well-being for their children, because they know that with us they find footwear designed and made with quality standards for the well-being of the little ones. We want Vincero to be a national reference and a source of inspiration for the evolution of children\'s footwear.',
    
    // Shipping info
    freeShippingInfo: 'Free shipping on your order!',
    minPurchaseShipping: 'Add $800 MXN or more for free shipping',
    
    // Checkout form
    checkout: 'Checkout',
    name: 'Name',
    phone: 'Phone',
    continueWhatsApp: 'Continue with WhatsApp',
    
    // Menu
    catalog: 'Catalog',
    seasonNormal: 'Low Collection by VINCERO',
    seasonHigh: 'High Collection by VINCERO',
    seasonBallerina: 'Balerina Collection by VINCERO',
    seasonMulticolor: 'Multicolor Collection by VINCERO',
    seasonLightyear: 'LIGHTYEAR Collection by VINCERO',
    selectSeason: 'Select a collection',
    seasonNormalDesc: 'Classic collection for everyday',
    seasonHighDesc: 'Premium special edition collection',
    seasonBallerinaDesc: 'Elegant and feminine style',
    seasonMulticolorDesc: 'Vibrant and unique design',
    seasonLightyearDesc: 'To infinity and beyond',
    ourProcess: 'Our Process',
  },
  
  ko: {
    // Header
    cart: '장바구니',
    
    // Hero
    heroTitle: 'VINCERO',
    heroSubtitle: 'First Steps',
    exploreDesigns: '디자인 탐색',
    
    // Navigation
    home: '홈',
    search: '검색',
    wishlist: '위시리스트',
    profile: '프로필',
    
    // Products
    mostPopular: '가장 인기',
    favorite: '인기 상품',
    limitedEdition: '한정판',
    classic: '클래식',
    newProduct: '신상품',
    trending: '트렌드',
    popular: '인기',
    exclusive: '독점',
    winterCollection: '가을/겨울 컬렉션',
    ballerina: '발레리나',
    lightyear: '라이트이어',
    combat: '컴뱃',
    
    // Product descriptions
    productDesc: '통기성과 유연성이 뛰어난 섬유 소재의 스포츠-캐주얼 신발입니다. 피부에 부드러운 섬유 내부. 뛰어난 접지력과 내구성의 PVC 밑창. 현대적이고 기능적인 디자인. 사이즈 13mx ~ 17mx.',
    productDescHigh: '통기성과 유연성이 뛰어난 섬유 소재의 하이탑 스포츠 신발입니다. 피부에 부드러운 섬유 내부. 뛰어난 접지력과 내구성의 PVC 밑창. 현대적이고 기능적인 디자인. 사이즈 17mx ~ 21mx.',
    productDescWinter: '통기성과 유연성이 뛰어난 섬유 소재의 가을/겨울 시즌 스포츠 신발입니다. 피부에 부드러운 섬유 내부. 뛰어난 접지력과 내구성의 PVC 밑창. 현대적이고 기능적인 디자인. 사이즈 13mx ~ 17mx.',
    productDescBallerina: '부드럽고 유연한 섬유 소재의 발레리나 스타일 신발입니다. 최대한의 편안함을 위한 쿠션 내부. 뛰어난 접지력의 PVC 밑창. 모든 경우에 완벽한 우아하고 여성스러운 디자인. 사이즈 13mx ~ 17mx.',
    productDescLightyear: '우주 모험에서 영감을 받은 스포츠 신발로, 내구성과 유연성이 뛰어난 섬유 소재로 제작되었습니다. 최대한의 편안함을 위한 쿠션 내부. 뛰어난 접지력과 내구성의 PVC 밑창. 작은 탐험가들에게 완벽한 현대적이고 역동적인 디자인. 사이즈 13mx ~ 17mx.',
    productDescCombat: '내구성과 통기성이 뛰어난 섬유 소재의 하이탑 컴뱃 스타일 스포츠 스니커즈입니다. 강화된 디테일의 현대적인 전술 디자인. 최대한의 편안함을 위한 쿠션 내부. 뛰어난 접지력과 내구성의 PVC 밑창. 도시 모험에 완벽합니다. 사이즈 17mx ~ 21mx.',
    
    // Product names
    productName1: '아동용 스포츠 스니커즈 ITALIA/CARAMEL',
    productName2: '아동용 스포츠 스니커즈 ROSA B./ BLANCO',
    productName3: '아동용 스포츠 스니커즈 OXFORD /PLATA',
    productName4: '아동용 스포츠 스니커즈 BLANCO/ NEGRO',
    productName5: '아동용 하이탑 스니커즈 BLANCO',
    productName6: '아동용 하이탑 스니커즈 CARAMEL',
    productName7: '아동용 하이탑 스니커즈 MARINO',
    productName8: '아동용 하이탑 스니커즈 NEGRO',
    productName9: '아동용 스포츠 스니커즈 MULTICOLOR',
    productName10: '아동용 발레리나 스니커즈 핑크',
    productName11: '아동용 발레리나 스니커즈 블랙/화이트',
    productName12: '아동용 발레리나 스니커즈 레드',
    productName13: '아동용 발레리나 스니커즈 블랙',
    productName14: '아동용 하이탑 스니커즈 OXFORD',
    productName15: '아동용 라이트이어 스니커즈 블랙/화이트',
    productName16: '아동용 라이트이어 스니커즈 V. 플래그/화이트',
    productName17: '아동용 라이트이어 스니커즈 블루/화이트',
    productName18: '아동용 라이트이어 스니커즈 핑크/화이트',
    productName19: '하이 컴뱃 스니커즈 화이트',
    productName20: '하이 컴뱃 스니커즈 카라멜',
    productName21: '하이 컴뱃 스니커즈 옥스포드',
    
    // Video section
    videoTitle: '우리의',
    videoTitleHighlight: '스니커즈를 확인하세요',
    videoDesc: '이 비디오에서 아동용 스포츠 스니커즈의 품질과 스타일을 확인하세요.',
    
    // Shop section
    bestSellers: '베스트셀러',
    bestSellersDesc: '커뮤니티에서 가장 사랑받는 제품입니다. 왜 인기 있는지 알아보세요.',
    viewCollection: '전체 컬렉션 보기',
    quickView: '빠른 보기',
    add: '추가',
    
    // Cart
    shoppingCart: '장바구니',
    emptyCart: '장바구니가 비어 있습니다',
    subtotal: '소계',
    total: '총계',
    buyWhatsApp: 'WhatsApp으로 구매',
    remove: '삭제',
    
    // Wishlist
    myWishlist: '내 위시리스트',
    emptyWishlist: '위시리스트가 비어 있습니다',
    emptyWishlistDesc: '마음에 드는 제품을 추가하세요',
    addAll: '전체 장바구니에 추가',
    addToCart: '장바구니에 추가',
    removeItem: '제거',
    
    // Search
    searchProducts: '제품 검색...',
    typeToSearch: '제품을 검색하려면 입력하세요',
    resultsFor: '검색 결과',
    noProductsFound: '제품을 찾을 수 없습니다',
    cancel: '취소',
    
    // Profile
    myProfile: '내 프로필',
    welcomeVincero: 'Vincero에 오신 것을 환영합니다',
    loginAccess: '프로필에 접근하려면 로그인하세요',
    myOrders: '내 주문',
    viewHistory: '구매 내역 보기',
    support: '지원',
    contactWhatsApp: 'WhatsApp으로 문의',
    login: '로그인',
    createAccount: '계정 만들기',
    
    // Size selector
    selectSize: '사이즈 선택',
    availableSizes: '사용 가능한 사이즈:',
    addSize: '사이즈 추가',
    selectSizeFirst: '사이즈를 선택하세요',
    
    // Checkout
    completeData: '정보 입력',
    fullName: '성명',
    phoneNumber: '전화번호',
    orderSummary: '주문 요약',
    sendOrderWhatsApp: 'WhatsApp으로 주문 보내기',
    
    // Product detail
    productDetails: '제품 상세',
    description: '설명',
    details: '상세 정보',
    color: '색상',
    availableSizesLabel: '사용 가능한 사이즈',
    material: '소재',
    warranty: '보증',
    warrantyValue: '30일',
    
    // Auth extended
    register: '회원가입',
    email: '이메일',
    password: '비밀번호',
    confirmPassword: '비밀번호 확인',
    forgotPassword: '비밀번호를 잊으셨나요?',
    noAccount: '계정이 없으신가요?',
    hasAccount: '이미 계정이 있으신가요?',
    loginSuccess: '다시 오신 것을 환영합니다!',
    registerSuccess: '계정이 성공적으로 생성되었습니다!',
    logout: '로그아웃',
    myAccount: '내 계정',
    orderHistory: '주문 내역',
    noOrders: '아직 주문이 없습니다',
    orderDate: '날짜',
    orderStatus: '상태',
    orderTotal: '합계',
    statusPending: '대기 중',
    statusConfirmed: '확인됨',
    statusShipped: '배송됨',
    statusDelivered: '배달됨',
    statusCancelled: '취소됨',
    welcomeBack: '다시 오신 것을 환영합니다!',
    loginToContinue: '계속하려면 로그인하세요',
    joinUs: 'VINCERO 가입하기',
    
    // Collections
    sportCollection: 'Low 컬렉션 by VINCERO',
    highCollection: 'High 컬렉션 by VINCERO',
    winterCollectionName: '가을/겨울 컬렉션',
    ballerinaCollection: '발레리나 컬렉션 by VINCERO',
    multicolorCollection: '멀티컬러 컬렉션 by VINCERO',
    styleComfort: '스타일과 편안함',
    newSportCollection: '새로운 스포츠 컬렉션',
    winterStyle: '시즌 스타일',
    
    // Testimonials
    testimonialTitle: '고객',
    testimonialTitleHighlight: '후기',
    testimonialDesc: '자녀의 신발을 Vincero에 맡기는 만족한 부모님들.',
    
    // Testimonial content
    testimonial1Name: '라우라 멘도사',
    testimonial1Role: '인증된 엄마',
    testimonial1Content: '품질이 훌륭하고 매우 편안하며 내구성이 좋습니다. 몇 달간 매일 사용해도 새것처럼 보여요. 디자인이 예쁘고 아이가 좋아해요.',
    testimonial2Name: '로베르토 가르시아',
    testimonial2Role: '인증된 아빠',
    testimonial2Content: '좋은 구매였습니다. 밑창이 튼튼하고 소재가 통기성이 좋으며 신기 쉬워요. 일상용으로 강력 추천합니다.',
    testimonial3Name: '',
    testimonial3Role: '',
    testimonial3Content: '',
    
    // Features
    whyChoose: '왜',
    whyChooseHighlight: 'Vincero를 선택할까요',
    whyChooseDesc: '모든 디테일에서 뛰어난 품질. 최고를 추구하는 분들을 위해 디자인되었습니다.',
    qualityGuarantee: '품질 보증',
    qualityGuaranteeDesc: '모든 제품은 30일 보증이 적용됩니다. 오래 지속되는 품질.',
    innovativeDesign: '혁신적인 디자인',
    innovativeDesignDesc: '아이들이 좋아하는 현대적이고 다채로운 디자인.',
    totalComfort: '완벽한 편안함',
    totalComfortDesc: '하루 종일 놀기에 완벽한 쿠션 밑창.',
    
    // Footer
    footerTagline: '아이들을 위한 스타일리시한 신발',
    stores: '매장',
    contact: '연락처',
    
    // Philosophy section
    aboutUs: '회사 소개',
    philosophySubtitle: '철학',
    aboutProduct: '우리의 신발',
    aboutProductDesc: '우리 제품은 스포츠-캐주얼 신발로, 통기성과 유연성이 뛰어난 섬유 소재로 제작되어 스포츠 활동과 일상 사용에 이상적입니다. 내부도 섬유 소재로 피부에 부드럽고 쾌적한 느낌을 제공합니다. PVC 밑창은 뛰어난 접지력과 내구성을 제공하여 아이들이 다양한 표면에서 자신 있게 이동할 수 있습니다. 현대적이고 기능적인 디자인으로, 이 운동화는 아이들의 일상 모험에 완벽한 동반자입니다.',
    ourValues: '우리의 가치',
    valueCare: '배려',
    valueCareDesc: '모든 제품은 아이들의 안전을 위해 디자인되었습니다.',
    valueInnovation: '끊임없는 혁신',
    valueInnovationDesc: '신발 제작 과정에서 최고 품질의 소재로 탐색, 디자인, 창조합니다.',
    valueCreativity: '창의성',
    valueCreativityDesc: '독점성은 디테일에 있습니다.',
    valueCommitment: '헌신',
    valueCommitmentDesc: '각 가정의 편안함을 위해 일과 신뢰를 "존중"합니다.',
    valueInclusion: '포용',
    valueInclusionDesc: '각 디자인이 소속감을 갖도록 촉진합니다.',
    ourMission: '우리의 미션',
    missionContent: '안전하고 편안하며 스타일리시한 신발로 어린 시절의 가장 중요한 발걸음을 함께합니다. Vincero에서는 부모에게 신뢰를, 아이들에게 자유를 주는 신발을 만듭니다. 독점적인 디자인, 뛰어난 편안함, 모든 발걸음의 안전을 결합한 독특한 제품을 만들어 아동용 신발을 접근 가능한 수준으로 끌어올립니다. 어린 나이부터 자율성을 촉진합니다. Vincero에서는 혁신과 수작업을 스타일과 완벽한 품질로 어린 시절을 함께하는 경험으로 변환합니다.',
    ourVision: '우리의 비전',
    visionContent: 'Vincero가 자녀의 구별과 안녕을 추구하는 부모들의 첫 번째 선택이 되기를 원합니다. 우리와 함께라면 아이들의 안녕을 위한 품질 기준으로 디자인되고 제작된 신발을 찾을 수 있다는 것을 알기 때문입니다. Vincero가 국가적 기준이 되고 아동용 신발 발전의 영감의 원천이 되기를 원합니다.',
    
    // Shipping info
    freeShippingInfo: '$1,500 MXN 이상 주문 시 무료 배송',
    minPurchaseShipping: '배송 최소 구매액: $1,500 MXN',
    
    // Checkout form
    checkout: '결제',
    name: '이름',
    phone: '전화번호',
    continueWhatsApp: 'WhatsApp으로 계속',
    
    // Menu
    catalog: '카탈로그',
    seasonNormal: 'Low 컬렉션 by VINCERO',
    seasonHigh: 'High 컬렉션 by VINCERO',
    seasonBallerina: '발레리나 컬렉션 by VINCERO',
    seasonMulticolor: '멀티컬러 컬렉션 by VINCERO',
    seasonLightyear: 'LIGHTYEAR 컬렉션 by VINCERO',
    selectSeason: '컬렉션을 선택하세요',
    seasonNormalDesc: '일상을 위한 클래식 컬렉션',
    seasonHighDesc: '프리미엄 스페셜 에디션 컬렉션',
    seasonBallerinaDesc: '우아하고 여성스러운 스타일',
    seasonMulticolorDesc: '생동감 있고 독특한 디자인',
    seasonLightyearDesc: '무한대로, 그 너머로',
    ourProcess: '우리의 과정',
  },
}

export const languageNames: Record<Language, string> = {
  es: 'Español',
  en: 'English',
  ko: '한국어',
}

export const languageFlags: Record<Language, string> = {
  es: '🇲🇽',
  en: '🇺🇸',
  ko: '🇰🇷',
}
