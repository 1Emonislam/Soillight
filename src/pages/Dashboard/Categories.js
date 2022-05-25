import { Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CATEGORY_STORE, INSIDE_SUB_CATEGORY_STORE, PACK_TYPE, PROGRESS_CATEGORIES, SERVING_SIZE, SUB_CATEGORY_STORE } from '../../management/reducers/AllCetegoryReducer'
import DashboardHeader from './Sheard/DashboardHeader'
import Category from './UpdateCategories/Category'
import InsideSubCategory from './UpdateCategories/InsideSubCategory'
import PackType from './UpdateCategories/PackType'
import ServingSize from './UpdateCategories/ServingSize'
import SubCategory from './UpdateCategories/SubCategory'
function Categories() {
    const [categorySearch, setCategorySearch] = useState('');
    const [subCategorySearch, setSubCategorySearch] = useState('');
    const [insideSubCategorySearch, setInsideSubCategorySearch] = useState('');
    const [servingSizeSearch, setServingSizeSearch] = useState('');
    const [packTypeSearch, setPackTypeSearch] = useState('');
    const { userLogin } = useSelector(state => state)
    const [countCategory, setCountCategory] = useState('')
    const [countInsideSubCategory, setCountInsideSubCategory] = useState('')
    const [subCategoryCount, setSubCategoryCount] = useState('')
    const [packTypeCount, setPackTypeCount] = useState('')
    const [servingSizeCount, setServingSizeCount] = useState('')
    const [pageCategory, setPageCategory] = useState(1)
    const [pageSubCategory, setPageSubCategory] = useState(1)
    const [pageInsideSubCategory, setPageInsideSubCategory] = useState(1)
    const [packTypePage, setPackTypePage] = useState(1)
    const [servingSizePage, setServingSizePage] = useState(1)
    const limit = 10;
    const dispatch = useDispatch()
    useEffect(() => {
        if (!userLogin?.user?.token) return
        dispatch({
            type: PROGRESS_CATEGORIES,
            payload: {
                loading: true
            }
        })
        fetch(`http://18.142.184.204:7000/category?search=${categorySearch || ''}&page=${pageCategory}&limit=${limit}`, {
            method: 'GET',
            headers: {
                "Content-type": "application/json",
                'Authorization': `Bearer ${userLogin?.user?.token}`
            },
        })
            .then(res => res.json())
            .then(data => {
                setCountCategory(data.count)
                // console.log(data)
                dispatch({
                    type: PROGRESS_CATEGORIES,
                    payload: {
                        loading: false
                    }
                })
                // console.log(data)
                dispatch({
                    type: CATEGORY_STORE,
                    payload: {
                        category: data.data
                    }
                })
            })
    }, [dispatch, userLogin?.user?.token, categorySearch, pageCategory])
    // console.log(subCategorySearch)
    useEffect(() => {
        if (!userLogin?.user?.token) return
        dispatch({
            type: PROGRESS_CATEGORIES,
            payload: {
                loading: true
            }
        })
        fetch(`http://18.142.184.204:7000/sub/category?search=${subCategorySearch || ''}&page=${pageSubCategory}&limit=${limit}`, {
            method: 'GET',
            headers: {
                "Content-type": "application/json",
                'Authorization': `Bearer ${userLogin?.user?.token}`
            },
        })
            .then(res => res.json())
            .then(data => {
                setSubCategoryCount(data.count)
                dispatch({
                    type: PROGRESS_CATEGORIES,
                    payload: {
                        loading: false
                    }
                })
                // console.log(data)
                dispatch({
                    type: SUB_CATEGORY_STORE,
                    payload: {
                        subCategory: data.data
                    }
                })
            })
    }, [dispatch, userLogin?.user?.token, subCategorySearch, pageSubCategory])
    useEffect(() => {
        if (!userLogin?.user?.token) return
        dispatch({
            type: PROGRESS_CATEGORIES,
            payload: {
                loading: true
            }
        })
        fetch(`http://18.142.184.204:7000/inside/sub/category?search=${insideSubCategorySearch || ''}&page=${pageInsideSubCategory}&limit=${limit}`, {
            method: 'GET',
            headers: {
                "Content-type": "application/json",
                'Authorization': `Bearer ${userLogin?.user?.token}`
            },
        })
            .then(res => res.json())
            .then(data => {
                setPackTypeCount(data.count)
                dispatch({
                    type: PROGRESS_CATEGORIES,
                    payload: {
                        loading: false
                    }
                })
                // console.log(data)
                dispatch({
                    type: INSIDE_SUB_CATEGORY_STORE,
                    payload: {
                        insideSubCategory: data.data
                    }
                })
            })
    }, [dispatch, userLogin?.user?.token, insideSubCategorySearch, pageInsideSubCategory])
    useEffect(() => {
        if (!userLogin?.user?.token) return
        dispatch({
            type: PROGRESS_CATEGORIES,
            payload: {
                loading: true
            }
        })
        fetch(`http://18.142.184.204:7000/inside/pack/type?search=${packTypeSearch || ''}&page=${packTypePage}&limit=${limit}`, {
            method: 'GET',
            headers: {
                "Content-type": "application/json",
                'Authorization': `Bearer ${userLogin?.user?.token}`
            },
        })
            .then(res => res.json())
            .then(data => {
                setPackTypeCount(data.count)
                dispatch({
                    type: PROGRESS_CATEGORIES,
                    payload: {
                        loading: false
                    }
                })
                // console.log(data)
                dispatch({
                    type: PACK_TYPE,
                    payload: {
                        packType: data.data
                    }
                })
            })
    }, [dispatch, userLogin?.user?.token, packTypeSearch, packTypePage])
    useEffect(() => {
        if (!userLogin?.user?.token) return
        dispatch({
            type: PROGRESS_CATEGORIES,
            payload: {
                loading: true
            }
        })
        fetch(`http://18.142.184.204:7000/inside/serving/size?search=${servingSizeSearch || ''}&page=${servingSizePage}&limit=${limit}`, {
            method: 'GET',
            headers: {
                "Content-type": "application/json",
                'Authorization': `Bearer ${userLogin?.user?.token}`
            },
        })
            .then(res => res.json())
            .then(data => {
                setPackTypeCount(data.count)
                dispatch({
                    type: PROGRESS_CATEGORIES,
                    payload: {
                        loading: false
                    }
                })
                // console.log(data)
                dispatch({
                    type: SERVING_SIZE,
                    payload: {
                        servingSize: data.data
                    }
                })
            })
    }, [dispatch, userLogin?.user?.token, servingSizePage, servingSizeSearch])
    return (
        <div className='categories-box'>
            <DashboardHeader title="Categories" />
            <Grid container spacing={1} alignItems="stretch">
                <Grid item xs={12} md={3.1} className="box-category">
                    <Category title="Category" setCategorySearch={setCategorySearch} limit={limit} pageCategory={pageCategory} setPageCategory={setPageCategory} searchTitle="Category" countCategory={countCategory} />
                </Grid>
                <Grid item xs={12} md={3.1}>
                    <SubCategory title="Sub Category" setSubCategorySearch={setSubCategorySearch} limit={limit} pageSubCategory={pageSubCategory} setPageSubCategory={setPageSubCategory} searchTitle="Sub Category" subCategoryCount={subCategoryCount} />
                </Grid>
                <Grid item xs={12} md={2.5}>
                    <InsideSubCategory title="Inside Sub " insideSubCategorySearch={insideSubCategorySearch} setInsideSubCategorySearch={setInsideSubCategorySearch} limit={limit} pageInsideSubCategory={pageInsideSubCategory} setPageInsideSubCategory={setPageInsideSubCategory} searchTitle="Inside Sub Category" countInsideSubCategory={countInsideSubCategory} setCountInsideSubCategory={setCountInsideSubCategory} />
                </Grid>

                <Grid item xs={12} md={1.4}>
                    <PackType title="Pack Type" setPackTypeSearch={setPackTypeSearch} limit={limit} packTypePage={packTypePage} setPackTypePage={setPackTypePage} searchTitle="Pack Type" packTypeCount={packTypeCount} />
                </Grid>

                <Grid item xs={12} md={1.8}>
                    <ServingSize title="Serving Size" setServingSizeSearch={setServingSizeSearch} limit={limit} servingSizeSearch={servingSizeSearch} servingSizePage={servingSizePage} setServingSizePage={setServingSizePage} servingSizeCount={servingSizeCount} setServingSizeCount={setServingSizeCount} searchTitle="Serving Size"/>
                </Grid>
            </Grid>
        </div>
    )
}

export default Categories