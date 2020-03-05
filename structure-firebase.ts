

const accounts = [{
    account_id: '...',
    email: '...',
    phoneNumber: '',
    displayName: '',
    photoURL: '...',
    createdAt: 1583333336000,
    emailVerified: true,
    disabled: false,
    role: 'admin' || 'admin_product' || 'consumer'
}
];

const block_accounts = [{
    account_id: '...'
}]

const brands = [
    {
        name: 'Honda' || 'Samsung',
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
        category: 'Motobike',
        brand: 'Sony',
        typeMarket: 'premium' || 'marketplace',
        owner: {
            account_id: '....',
            displayName: 'admin',
            picture: 'url'
        },
        createdAt: 1452488445471,
        updatedAt: 1452488445471
    }
]

const favourites = [
    {
        id: '....',
        account_id: 'account1',
        product_id: '....',
        name: 'Future 2018',
        originalPrice: 500,
        salelPrice: 400,
        discount: 20,
        typeMarket: 'premium' || 'marketplace',
        images: ['url1', 'url2']
    }
]


