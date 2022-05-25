import { Grid, Pagination } from "@mui/material";
import React, { useState } from 'react';
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { BsSearch, BsThreeDots } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { SELECTED_SERVING_SIZE } from "../../../management/reducers/AllCetegoryReducer";
import AllCategoriesCreate from "../CreateCategories/AllCategories";
import ServingSizeDetails from "./ServingSizeDetails";

function ServingSize({ title, limit, setServingSizePage, searchTitle, setServingSizeSearch, servingSizePage, servingSizeCount }) {
    const { category } = useSelector(state => state)
    const [categoriesOpen, setCategoiresOpen] = React.useState(false);
    const handleCategoriesOpen = () => setCategoiresOpen(true);
    const handleCategoriesClose = () => setCategoiresOpen(false);
    // console.log(category?.insideSubCategory)
    const [dataState, setDataState] = useState({
        activeObject: null,
        objects: [category?.servingSize]
    })
    React.useEffect(() => {
        if (category?.servingSize?.length) {
            setDataState({ activeObject: dataState?.activeObject, objects: [...category?.servingSize] })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category?.servingSize])
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

    const [servingSizeOpen, setServingSizeOpen] = React.useState(false);
    const handleServingSizeOpen = () => setServingSizeOpen(true);
    const handleServingSizeClose = () => setServingSizeOpen(false);
    const dispatch = useDispatch()
    const handleSingleClick = (servingSize, index) => {
        if (servingSize) {
            dispatch({
                type: SELECTED_SERVING_SIZE,
                payload: {
                    data: servingSize,
                }
            })
            toggleActive(index)
        }
        setServingSizeOpen(true)
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
                    <input className='searchInput' onChange={(e) => setServingSizeSearch(e.target.value)} type="text" sx={{ borderRadius: '20px', marginLeft: '30px' }} placeholder={`Search for ${searchTitle}`} />
                    <div className="searchInput-icon">
                        <BsSearch />
                    </div>
                    <div style={{ paddingLeft: '30px' }}>
                        <p style={{ fontSize: '16px', color: '#AAAAAA' }}>{servingSizeCount && <> Total: {servingSizeCount} </>}</p>
                    </div>
                    {category?.servingSize?.length !== 0 && category?.servingSize?.map((data, index) => (<button key={index} className={toggleActiveStyle(index)}>
                        {/* {console.log(data)} */}
                        <Grid container spacing={0} alignItems="center" textAlign="left">
                            <Grid item xs={11}>
                                <strong style={{ fontSize: '11px', marginRight: '3px' }}>{data?.servingSize}</strong>
                            </Grid>
                            <Grid item xs={1}>
                                <BsThreeDots onClick={() => handleSingleClick(data, index)} />
                                {/* {console.log(insideSubCategoryInfo)} */}
                                <ServingSizeDetails handleServingSizeClose={handleServingSizeClose} handleServingSizeOpen={handleServingSizeOpen} setServingSizeOpen={setServingSizeOpen} servingSizeOpen={servingSizeOpen} />
                            </Grid>
                        </Grid>
                    </button>))}
                    <Pagination
                        count={Math.ceil(servingSizeCount / limit)}
                        color="secondary"
                        variant="outlined"
                        onChange={(e, value) => setServingSizePage(value)}
                    />
                </div>
            </div >
        </div>
    )
}

export default ServingSize