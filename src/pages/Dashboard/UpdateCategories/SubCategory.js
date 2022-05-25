import { Grid, Pagination } from "@mui/material";
import React, { useState } from 'react';
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { BsSearch, BsThreeDots } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { SELECTED_SUB_CATEGORY } from "../../../management/reducers/AllCetegoryReducer";
import AllCategoriesCreate from "../CreateCategories/AllCategories";
import Loading from "../Sheard/Loading";
import SubCategoryDetails from "./SubCategoryDetails";

function SubCategory({ title, setSubCategorySearch, limit, setPageSubCategory, subCategoryCount, searchTitle }) {
    const { category } = useSelector(state => state)
    const [categoriesOpen, setCategoiresOpen] = React.useState(false);
    const handleCategoriesOpen = () => setCategoiresOpen(true);
    const handleCategoriesClose = () => setCategoiresOpen(false);

    const [dataState, setDataState] = useState({
        activeObject: null,
        objects: [category?.subCategory]
    })
    React.useEffect(() => {
        setDataState({ activeObject: dataState?.activeObject, objects: [...category?.subCategory] })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category?.subCategory])
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

    const [subCategoryDetailsOpen, setSubCategoryDetailsOpen] = React.useState(false);
    const handleSubCategoryDetailsOpen = () => setSubCategoryDetailsOpen(true);
    const handleSubCategoryDetailsClose = () => setSubCategoryDetailsOpen(false);
    const dispatch = useDispatch()
    const handleSingleClick = (subCategory,index) => {
        if (subCategory) {
            dispatch({
                type: SELECTED_SUB_CATEGORY,
                payload: {
                    data: subCategory,
                }
            })
            toggleActive(index)
        }
        setSubCategoryDetailsOpen(true)
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
                    <input className='searchInput' onChange={(e) => setSubCategorySearch(e.target.value)} type="text" sx={{ borderRadius: '20px', marginLeft: '30px' }} placeholder={`Search for ${searchTitle}`} />
                    <div className="searchInput-icon">
                        <BsSearch />
                    </div>
                    {!category?.subCategory ? <Loading /> : category?.subCategory?.map((data, index) => (<button className={toggleActiveStyle(index)}key={data?._id}>
                        <Grid container spacing={0} alignItems="center" textAlign="left">
                            <Grid item xs={3}>
                                <>
                                    <img className="img-box-list-item" style={{ borderRadius: '50px', width: "43px", height: '43px', border: '2px solid #F5AB24' }} src={data?.img} alt={data?.subCategory} />
                                </>
                            </Grid>
                            <Grid item xs={7}>
                                <strong style={{ fontSize: '11px', marginRight: '3px' }}>{data?.subCategory}</strong>
                                <div>
                                    <small style={{ display: 'flex', fontSize: "10px", alignItems: 'center', marginBottom: '5px' }}>age: {data?.age}</small>
                                </div>
                            </Grid>
                            <Grid item xs={1}>
                                <BsThreeDots onClick={() => handleSingleClick(data,index)} />
                                <SubCategoryDetails handleSubCategoryDetailsOpen={handleSubCategoryDetailsOpen} handleSubCategoryDetailsClose={handleSubCategoryDetailsClose} subCategoryDetailsOpen={subCategoryDetailsOpen} />
                            </Grid>
                        </Grid>
                    </button>))}
                    <Pagination
                        count={Math.ceil(subCategoryCount / limit)}
                        color="secondary"
                        variant="outlined"
                        onChange={(e, value) => setPageSubCategory(value)}
                    />
                </div>
            </div >
        </div>
    )
}

export default SubCategory