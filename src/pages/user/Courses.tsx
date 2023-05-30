import * as React from "react";
import { Container, Divider, FormControl, Grid, IconButton, MenuItem, Pagination, Paper, Select, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import WebViewNavbar from "@/common/LayoutNavigations/webviewnavbar";
import WebViewFooter from "@/common/LayoutNavigations/webviewfooter";
import styles from '../../styles/webview.module.css'
import GridViewIcon from '@mui/icons-material/GridView';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { HandleCourseGet } from "@/services/course";
import { CourseCard, CourseCardListView } from "@/common/ResuableCardCmp/coursescard";
import { usePagination } from "@/common/Pagination/paginations";
import SpinnerProgress from "@/common/CircularProgressComponent/spinnerComponent";

export default function Courses() {
    const [courseData, setcourseData] = React.useState([]);
    const [courseStatus, setcourseStatus] = React.useState(1);
    const [gridview, setgridview] = React.useState(true)
    const [listview, setlistview] = React.useState(false)
    const [loader, setLoadar] = React.useState(true);
    const landingpagecontent = {
        image: 'https://source.unsplash.com/random',
    };
    const setcustStatus = (e: any) => {
        setLoadar(true)
        const is_chargeable = e === 2 ? "free" : e === 3 ? "paid" : 0
        setcourseStatus(e);
        HandleCourseGet('', {
            is_chargeable: is_chargeable,
            status: 0
        }).then((courses) => {
            setcourseData(courses?.data)
            setLoadar(false)
        })
    }

    //get courses
    const getAllCourseData = () => {
        setLoadar(true)
        HandleCourseGet('', "").then((courses) => {
            setcourseData(courses?.data)
            setLoadar(false);
        })
    }
    React.useEffect(() => {
        getAllCourseData();
    }, [])


    //pagination
    const [row_per_page, set_row_per_page] = React.useState(8);
    let [page, setPage] = React.useState<any>(1);
    function handlerowchange(e: any) {
        set_row_per_page(e.target.value);
    }
    const PER_PAGE = row_per_page;
    const count = Math.ceil(courseData?.length / PER_PAGE);
    const DATA = usePagination(courseData, PER_PAGE);
    const handlePageChange = (e: any, p: any) => {
        setPage(p);
        DATA.jump(p);
    };

    //gridview listview
    const gridView = () => {
        setgridview(false)
        setlistview(true);
    }
    const listView = () => {
        setlistview(true);
        setgridview(true)
    }

    return (
        <>
            {/*header*/}
            <WebViewNavbar />
            {/*Landing page carousel*/}
            <Paper
                sx={{
                    position: 'relative',
                    backgroundColor: 'grey.800',
                    color: '#fff',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundImage: `url(${landingpagecontent.image})`,
                }}
                className={styles.coursebanner}
            >
            </Paper>
            {/*courses*/}
            <Box className={styles.courses}>
                <Container maxWidth="lg">
                    <Grid className={styles.filtersection}>
                        <Grid spacing={2} className={styles.filtercontainer}>
                            <Grid item xs={12} md={3} lg={3}>
                                <Stack spacing={1}>
                                    <FormControl fullWidth>
                                        <Select
                                            className={styles.filterinput}
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            size="small"
                                            onChange={(e: any) =>
                                                setcustStatus(e.target.value)
                                            }
                                            value={courseStatus}
                                        >
                                            <MenuItem value={1}>
                                                Filter By
                                            </MenuItem>
                                            <MenuItem value={2}>
                                                Free
                                            </MenuItem>
                                            <MenuItem value={3}>
                                                Paid
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={6} lg={3} className={styles.gridbtn} >
                                <Stack spacing={1} className={styles.gridicon}>
                                    <IconButton className={styles.actionview} onClick={gridView}>
                                        <GridViewIcon />
                                    </IconButton>
                                    <IconButton className={styles.actionview} onClick={listView}>
                                        <FormatListBulletedIcon />
                                    </IconButton>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Box className={styles.coursesheaderbox}>
                        <Typography variant="h6" gutterBottom className={styles.h6}>
                            Courses Information
                        </Typography>
                        <Divider className={styles.divder} />
                    </Box>
                    {loader ? (
                        <SpinnerProgress />
                    ) : (
                        <Box className={styles.articles}>
                            {courseData && DATA.currentData() &&
                                DATA.currentData().map((data: any, key: any) => {
                                    return (
                                        <>
                                            {gridview ? (<CourseCard coursedata={data} />) : ("")}

                                        </>

                                    )
                                })}
                        </Box>
                    )}
                    <Box className={styles.listviewarticles}>
                        <Container maxWidth="lg">
                            {listview ? (<>
                                {courseData && DATA.currentData() &&
                                    DATA.currentData().map((data: any, key: any) => {
                                        return (
                                            <>
                                                <CourseCardListView coursedata={data} />
                                            </>
                                        )
                                    })}
                            </>
                            ) : ""}
                        </Container>
                    </Box>
                    <Grid className={styles.filtersection} pb={6} pt={3}>
                        <Grid spacing={2} className={styles.filtercontainer}>
                            <Grid item xs={12} md={3} lg={3}>
                                <Stack spacing={1}>
                                    <Pagination
                                        count={count}
                                        page={page}
                                        color="primary"
                                        onChange={handlePageChange}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={6} lg={3} className={styles.perpagedt} >
                                <Box sx={{ display: 'flex' }}>
                                    <Typography sx={{ margin: 'auto' }} >
                                        Showing {row_per_page} of {courseData?.length} Results</Typography>
                                    <FormControl>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            defaultValue={8}
                                            onChange={handlerowchange}
                                            size="small"
                                            className={styles.paignation}
                                            style={{ height: "35px", marginRight: '11px' }}
                                            sx={{ margin: '0px 0px 0px 15px' }}
                                        >
                                            <MenuItem value={8}>8</MenuItem>
                                            <MenuItem value={20}>20</MenuItem>
                                            <MenuItem value={50}>50</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Container >
            </Box >
            <WebViewFooter />

        </>
    );
}
