import { Grid, Pagination } from "@mui/material";
import React, { useState } from 'react';
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { BsSearch, BsThreeDots } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { SELECTED_CATEGORY } from "../../../management/reducers/AllCetegoryReducer";
import AllCategoriesCreate from "../CreateCategories/AllCategories";
import Loading from "../Sheard/Loading";
import CategoryDetails from "./CategoryDetails";


function Category({ title, setCategorySearch, limit, setPageCategory, searchTitle, countCategory }) {
    const [categoriesOpen, setCategoiresOpen] = React.useState(false);
    const { category } = useSelector(state => state)
    const handleCategoriesOpen = () => setCategoiresOpen(true);
    const handleCategoriesClose = () => setCategoiresOpen(false);
    const dispatch = useDispatch()
    const [dataState, setDataState] = useState({
        activeObject: null,
        objects: [...category?.category]
    })
    React.useEffect(() => {
        setDataState({ activeObject: dataState?.activeObject, objects: [...category?.category] })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category?.category])
    function toggleActive(index) {
        setDataState({ ...dataState, activeObject: dataState.objects[index] })
    }
    function toggleActiveStyle(index) {
        if (dataState.objects[index] === dataState.activeObject) {
            return 'user-list active'
        } else {
            return 'user-list inactive'
        }
    }

    const [categoryDetailsOpen, setCategoryDetailsOpen] = React.useState(false);
    const handleCategoryDetailsOpen = () => setCategoryDetailsOpen(true);
    const handleCategoryDetailsClose = () => setCategoryDetailsOpen(false);
    const handleSingleClick = (category, index) => {
        if (category) {
            dispatch({
                type: SELECTED_CATEGORY,
                payload: {
                    data: category,
                }
            })
            toggleActive(index)
        }
        setCategoryDetailsOpen(true)
    }
    return (
        <div>
            <div className='search-container-box'>
                <div style={{ display: "flex", alignItems: 'center', justifyContent: 'space-around' }}>
                    <h4 className='search-title' style={{ paddingLeft: '0px' }}>{title}</h4>
                    <AiOutlineAppstoreAdd style={{ fontSize: '20px', cursor: 'pointer' }} onClick={handleCategoriesOpen} />
                    <AllCategoriesCreate categoriesOpen={categoriesOpen} handleCategoriesOpen={handleCategoriesOpen} handleCategoriesClose={handleCategoriesClose} />
                </div>
                <div className='searchInput-relative'>
                    <input className='searchInput' onChange={(e) => setCategorySearch(e.target.value)} type="text" sx={{ borderRadius: '20px', marginLeft: '30px' }} placeholder={`Search for ${searchTitle}`} />
                    <div className="searchInput-icon">
                        <BsSearch />
                    </div>
                    <div style={{ paddingLeft: '30px' }}>
                        <p style={{ fontSize: '16px', color: '#AAAAAA' }}>{countCategory && <> Total: {countCategory} </>}</p>
                    </div>
                    {!category?.category ? <Loading /> : category?.category?.map((category, index) => (<button className={toggleActiveStyle(index)} key={category?._id}>
                        <Grid container spacing={0} alignItems="center" textAlign="left">
                            <Grid item xs={3}>
                                <>
                                    <img className="img-box-list-item" style={{ borderRadius: '50px', width: "43px", height: '43px', border: '2px solid #F5AB24' }} src={category?.img} alt={category?.category} />
                                </>
                            </Grid>
                            <Grid item xs={7}>
                                <strong style={{ fontSize: '11px', marginRight: '3px' }}>{category?.category}</strong>
                                <div>
                                    <small style={{ display: 'flex', fontSize: "10px", alignItems: 'center', marginBottom: '5px' }}>age: {category?.age}</small>
                                </div>
                            </Grid>
                            <Grid item xs={1}>
                                <BsThreeDots onClick={() => handleSingleClick(category,index)} />
                                <CategoryDetails handleSingleClick={handleSingleClick} handleCategoryDetailsClose={handleCategoryDetailsClose} handleCategoryDetailsOpen={handleCategoryDetailsOpen} categoryDetailsOpen={categoryDetailsOpen} />
                            </Grid>
                        </Grid>

                    </button>))}
                    <Pagination
                        count={Math.ceil(countCategory / limit)}
                        color="secondary"
                        variant="outlined"
                        onChange={(e, value) => setPageCategory(value)}
                    />
                </div>
            </div >
        </div>
    )
}

export default Category