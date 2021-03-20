export default  [
    // {
    //     name : 'Super Admin',
    //     role : 'super_admin',
    //     icon : 'mask',
    //     children : [
    //         {
    //             name : "Tenant",
    //             icon : 'building',
    //             url : '/admin/list_tenant'
    //         },
    //         {
    //             name : "Subscription",
    //             icon : 'map',
    //             url : '/admin/list_subscriptions'
    //         },
    //         {
    //             name : "Tenant Subscription",
    //             icon : 'id-badge',
    //             url : '/admin/list_tenant_subscriptions'
    //         },
    //         {
    //             name : "Package",
    //             icon : 'align-left',
    //             url : '/admin/list_packages'
    //         },
    //         {
    //             name : "Module",
    //             icon : 'align-center',
    //             url : '/admin/list_modules'
    //         },
    //     ]
    // },
    {
        name : 'Masters',
        role : 'admin',
        icon : 'user-shield',
        children : [
            {
                name : "Ledger Category",
                icon : 'swatchbook',
                url : '/masters/list_ledger_category'
            },
            {
                name : "Ledger Group",
                icon : 'code-branch',
                url : '/masters/list_ledger_group'
            },
            {
                name : "Ledger",
                icon : 'code-branch',
                url : '/masters/list_ledger'
            },
            {
                name : "Product Category",
                icon : 'hat-cowboy',
                url : '/masters/list_product_category'
            },
            {
                name : "Product Group",
                icon : 'utensils',
                url : '/masters/list_product_group'
            },
            {
                name : "Product",
                icon : 'utensils',
                url : '/masters/list_product'
            },
            {
                name : "Unit",
                icon : 'users',
                url : '/masters/list_unit'
            },
            {
                name : "Color",
                icon : '',
                url : '/masters/list_color'
            },

            {
                name : "Master Group",
                icon : '',
                url : '/masters/list_masterGroup'
                },
            {
                name : "Process",
                icon : 'snowflake',
                url : '/masters/list_process'
            },
            {
                name : "Size",
                icon : 'chalkboard-teacher',
                url : '/masters/list_size'
            },
            // {
            //     name : "Staff",
            //     icon : 'chalkboard-teacher',
            //     url : '/masters/list_staffs'
            // },
            // {
            //     name : "Exercise",
            //     icon : 'dumbbell',
            //     url : '/masters/list_exercises'
            // },
            // {
            //     name : "Workouts",
            //     icon : 'bezier-curve',
            //     url : '/masters/list_workouts'
            // },
            // {
            //     name : "Add Less",
            //     icon : 'percentage',
            //     url : '/masters/list_addless'
            // },
        ]
    },
    // {
    //     name : 'Member Tools',
    //     role : 'admin',
    //     icon : 'users',
    //     children : [
    //         {
    //             name : 'Members',
    //             icon : 'user',
    //             url : '/masters/list_members'
    //         },
    //         {
    //             name : 'Member Plan',
    //             icon : 'holly-berry',
    //             url : '/masters/list_member_plans'
    //         },
    //     ]
    // },
    // {
    //     name : 'Transactions',
    //     role : 'admin',
    //     icon : 'exchange-alt',
    //     children : [
    //         {
    //             name : 'Workout Assign',
    //             icon : 'user',
    //             url : '/transactions/add_workout_assign'
    //         },
    //         {
    //             name : 'Nutritions Assign',
    //             icon : 'cloud-meatball',
    //             url : '/transactions/add_nutrition_assign'
    //         },
    //     ]
    // },
    // {
    //     name : 'Accounts',
    //     role : 'admin',
    //     icon : 'file-invoice-dollar',
    //     children : [
    //         {
    //             name : 'Fees Receipt',
    //             icon : "fa-file",
    //             url : '/transactions/add_fees_receipt'
    //         }
    //     ]
    // }
]