import { Grid, Pagination } from "@mui/material";
import React, { useState } from 'react';
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { BsSearch, BsThreeDots } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { SELECTED_PACKTYPE } from "../../../management/reducers/AllCetegoryReducer";
import AllCategoriesCreate from "../CreateCategories/AllCategories";
import Loading from "../Sheard/Loading";
import PackTypeDetails from "./PackTypeDetails";

function PackType({ title, setPackTypeSearch, limit, setPackTypePage, searchTitle, packTypePage, packTypeCount }) {
    const { category } = useSelector(state => state)
    const [categoriesOpen, setCategoiresOpen] = React.useState(false);
    const handleCategoriesOpen = () => setCategoiresOpen(true);
    const handleCategoriesClose = () => setCategoiresOpen(false);
    // console.log(category?.insideSubCategory)
    const [dataState, setDataState] = useState({
        activeObject: null,
        objects: [category?.packType]
    })
    React.useEffect(() => {
        if (category?.packType?.length) {
            setDataState({ activeObject: dataState?.activeObject, objects: [...category?.packType] })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category?.packType])
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

    const [packTypeOpen, setPackTypeOpen] = React.useState(false);
    const handlePackTypeDetailsOpen = () => setPackTypeOpen(true);
    const handlePackTypeDetailsClose = () => setPackTypeOpen(false);
    const dispatch = useDispatch()
    const handleSingleClick = (packType,index) => {
        if (packType) {
            dispatch({
                type: SELECTED_PACKTYPE,
                payload: {
                    data: packType,
                }
            })
            toggleActive(index)
        }
        setPackTypeOpen(true)
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
                    <input className='searchInput' onChange={(e) => setPackTypeSearch(e.target.value)} type="text" sx={{ borderRadius: '20px', marginLeft: '30px' }} placeholder={`Search for ${searchTitle}`} />
                    <div className="searchInput-icon">
                        <BsSearch />
                    </div>
                    {!category?.packType ? <Loading /> : category?.packType?.map((data, index) => (<button key={index} className={toggleActiveStyle(index)}>
                        {/* {console.log(data)} */}
                        <Grid container spacing={0} alignItems="center" textAlign="left">
                            <Grid item xs={11}>
                                <strong style={{ fontSize: '11px', marginRight: '3px' }}>{data?.packType}</strong>
                            </Grid>
                            <Grid item xs={1}>
                                <BsThreeDots onClick={() => handleSingleClick(data,index)} />
                                {/* {console.log(insideSubCategoryInfo)} */}
                                <PackTypeDetails handlePackTypeDetailsClose={handlePackTypeDetailsClose} handlePackTypeDetailsOpen={handlePackTypeDetailsOpen} packTypeOpen={packTypeOpen} />
                            </Grid>
                        </Grid>
                    </button>))}
                    <Pagination
                        count={Math.ceil(packTypeCount / limit)}
                        color="secondary"
                        variant="outlined"
                        onChange={(e, value) => setPackTypePage(value)}
                    />
                </div>
            </div >
        </div>
    )
}

export default PackType