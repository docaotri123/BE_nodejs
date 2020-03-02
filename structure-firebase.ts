

const accounts = [{
    name: 'Tri Do',
    email: 'dctri2197@email.com',
    password: '...',
    picture: 'url',
    createdAt: 1452488445471, // milliseconds
    updatedAt: 1452488445471,
    isActived: true,
    isBlocked: false,
    social: 'facebook' || null,
    role: 'admin' || 'admin_product' || 'customer'
}
];

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
        typeMarket: 'app' || 'marketplace',
        owner: {
            account_id: '....',
            name: 'admin',
            picture: 'url'
        },
        createdAt: 1452488445471,
        updatedAt: 1452488445471
    }
]

const favourites = [
    {
        id: '....',
        account: 'account1',
        product_id: '....',
        name: 'Future 2018',
        originalPrice: 500,
        salelPrice: 400,
        discount: 20,
        typeMarket: 'app' || 'marketplace',
        images: ['url1', 'url2']
    }
]


