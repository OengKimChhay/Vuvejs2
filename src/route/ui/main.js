
import Layout from '@/components/layout/Layout.vue';
// product====================================
import ProductList from '@/components/ui/product/ProductList.vue';
import CreateProduct from '@/components/ui/product/CreateProduct.vue';
// cateogry====================================
import CategoryList from '@/components/ui/cetegory/CategoryList.vue';
import CreateCategory from '@/components/ui/cetegory/CreateCategory.vue';

const routes =  [  
    { 
        path: '/', redirect: { name: 'Dashboard' },
    }, 
    {
        path: '/product',
        component: Layout,
        children:[
            {
                path: '',
                name: 'ProductList',
                component: ProductList,
                meta:{
                    title: 'Product List',
                    requiresAuth: true
                }
            },{
                path: 'create',
                name: 'CreateProduct',
                component: CreateProduct,
                meta:{
                    title: 'Create Product',
                    requiresAuth: true
                }
            },
        ]
    },
    {
        path: '/category',
        component: Layout,
        children:[
            {
                path: '',
                name: 'CategoryList',
                component: CategoryList,
                meta:{
                    title: 'Category List',
                    requiresAuth: true
                }
            },{
                path: 'create',
                name: 'CreateCategory',
                component: CreateCategory,
                meta:{
                    title: 'Create Category',
                    requiresAuth: true
                }
            },
        ]
    } 
]; 
export default routes;