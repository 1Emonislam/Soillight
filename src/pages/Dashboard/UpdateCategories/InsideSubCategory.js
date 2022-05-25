import { Grid, Pagination } from "@mui/material";
import React, { useState } from 'react';
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { BsSearch, BsThreeDots } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { SELECTED_INSIDE_SUB_SUB_CATEGORY } from "../../../management/reducers/AllCetegoryReducer";
import AllCategoriesCreate from "../CreateCategories/AllCategories";
import Loading from "../Sheard/Loading";
import InsideSubCategoryDetails from "./InsideSubCategoryDetails";

function InsideSubCategory({ title, insideSubCategorySearch, setInsideSubCategorySearch, limit, setPageInsideSubCategory, searchTitle, countInsideSubCategory }) {
    const { category } = useSelector(state => state)
    const [categoriesOpen, setCategoiresOpen] = React.useState(false);
    const handleCategoriesOpen = () => setCategoiresOpen(true);
    const handleCategoriesClose = () => setCategoiresOpen(false);
    // console.log(category?.insideSubCategory)
    const [dataState, setDataState] = useState({
        activeObject: null,
        objects: [category?.insideSubCategory]
    })
    React.useEffect(() => {
        if (category?.insideSubCategory?.length) {
            setDataState({ activeObject: dataState?.activeObject, objects: [...category?.insideSubCategory] })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category?.insideSubCategory])
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

    const [insideSubCategoryDetailsOpen, setInsideSubCategoryDetailsOpen] = React.useState(false);
    const handleInsideSubCategoryDetailsOpen = () => setInsideSubCategoryDetailsOpen(true);
    const handleInsideSubCategoryDetailsClose = () => setInsideSubCategoryDetailsOpen(false);
    const dispatch = useDispatch()
    const handleSingleClick = (insideSubCategory,index) => {
        if (insideSubCategory) {
            dispatch({
                type: SELECTED_INSIDE_SUB_SUB_CATEGORY,
                payload: {
                    data: insideSubCategory,
                }
            })
            toggleActive(index)
        }
        setInsideSubCategoryDetailsOpen(true)
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
                    <input className='searchInput' onChange={(e) => setInsideSubCategorySearch(e.target.value)} type="text" sx={{ borderRadius: '20px', marginLeft: '30px' }} placeholder={`Search for ${searchTitle}`} />
                    <div className="searchInput-icon">
                        <BsSearch />
                    </div>
                    <div style={{ paddingLeft: '30px' }}>
                        <p style={{ fontSize: '16px', color: '#AAAAAA' }}>{countInsideSubCategory && <> Total: {countInsideSubCategory} </>}</p>
                    </div>
                    {!category?.insideSubCategory ? <Loading /> : category?.insideSubCategory?.map((data, index) => (<button key={index} className={toggleActiveStyle(index) }>
                        {/* {console.log(data)} */}
                        <Grid container spacing={0} alignItems="center" textAlign="left">
                            <Grid item xs={11}>
                                <strong style={{ fontSize: '11px', marginRight: '3px' }}>{data?.insideSubCategory}</strong>
                            </Grid>
                            <Grid item xs={1}>
                                <BsThreeDots onClick={() => handleSingleClick(data,index)} />
                                {/* {console.log(insideSubCategoryInfo)} */}
                                <InsideSubCategoryDetails handleInsideSubCategoryDetailsClose={handleInsideSubCategoryDetailsClose} handleInsideSubCategoryDetailsOpen={handleInsideSubCategoryDetailsOpen} insideSubCategoryDetailsOpen={insideSubCategoryDetailsOpen} />
                            </Grid>
                        </Grid>
                    </button>))}
                    <Pagination
                        count={Math.ceil(countInsideSubCategory / limit)}
                        color="secondary"
                        variant="outlined"
                        onChange={(e, value) => setPageInsideSubCategory(value)}
                    />
                </div>
            </div >
        </div>
    )
}

export default InsideSubCategory