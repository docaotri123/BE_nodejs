

// all timestamp: millisecond 
const accounts = [{
    accountId: '...',
    email: '...',
    phoneNumber: '',
    countryCode: '84',
    phoneWhapsapp: '84965528621',
    displayName: '',
    photoURL: '...',
    providerId: 'google.com',
    emailVerified: true,
    disabled: false,
    createdAt: 1583333336000,
    numberProductMarkets: 10, // for product type: marketplace
    numberFavourites: 10,
    keywords: ['tri', 'do'],
    role: 'admin' || 'admin_product' || 'consumer'
}
];

// use for register account
const users = [
    {
        userId: '...',
        email: '...', // to update account and auth
        photoURL: '...',
        displayName: '',
        countryCode: '84',
        phoneWhatsapp: '84965528621'
    }
]

const brands = [
    {
        name: 'Honda' || 'Samsung',
        index: 0,
        numberProductPremiums: 5,
        numberProductMarkets: 3,
        keywords: []
    }
];

const  categories =[
    {
        name: 'Car' || 'Motobile' || 'Make up'
    }
]


const products = [
    {
        name: 'Future 2018',
        description: 'This is very useful with your health',
        size: '...',
        model: '...',
        originalPrice: 500,
        salelPrice: 400,
        discount: 20,
        images: ['url1', 'url2'],
        category: '...',
        brand: { // id '0' if input orther brand
            id: '...' || '',
            name: '...'
        },
        productType: 'premium' || 'marketplace',
        owner: {
            accountId: '....',
            displayName: 'admin',
            photoURL: 'url',
            phoneWhapsapp: '...'
        },
        createdAt: 1452488445471,
        updatedAt: 1452488445471
    }
]

const favourites = [
    {
        createdAt: '...',
        accountId: 'account1',
        productId: '....',
        name: 'Future 2018',
        originalPrice: 500,
        salelPrice: 400,
        discount: 20,
        productType: 'premium' || 'marketplace',
        images: ['url1', 'url2']
    }
]

const blockAccounts = [{
    accountId: '...'
}]

const manageAccount = [
    {
        numberAccounts: 100,
        numberBlockAccounts: 5
    }
]

const manageProduct = [
    {
        numberProductPremiums: 1000,
        numberProductMarkets: 600,
    }
];

const manageBrand = [
    {
        numberBrands: 40
    }
];

const registrationTokens = [
    {
        token: '...'
    }
]

const broadcastMessages = [
    {
        title: 'abc',
        body: '...',
        sendAt: 1583333336000,
        isSend: false
    }
]

// Check every new update of IOS and Android
const setting = [
    {
        IOSVersion: '1.0.0',
        AndroidVersion: '1.0.0',
        numberUploadImagesMarketplace: 50, // number images of marketPlace when creating new product
        numberUploadImagesPremium: 50
    }
]
