

const accounts = [{
    accountId: '...',
    email: '...',
    phoneNumber: '',
    phoneWhapsapp: '',
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

const users = [
    {
        userId: '...',
        photoURL: '...',
        displayName: '',
        phoneWhatsapp: ''
    }
]

const brands = [
    {
        name: 'Honda' || 'Samsung',
        numberProductPremiums: 10,
        numberProductMarkets: 5,
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
        id: '...',
        name: 'Future 2018',
        description: 'This is very useful with your health',
        size: '...',
        model: '...',
        originalPrice: 500,
        salelPrice: 400,
        discount: 20,
        images: ['url1', 'url2'],
        category: '...',
        brand: {
            id: '...',
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
        id: '....',
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