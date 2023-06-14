// ***** React Import
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";
// MUI Import
import { Box, Button, Card, CardContent, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
// External Components
import SideBar from "@/common/LayoutNavigations/sideBar";
import BreadcrumbsHeading from "@/common/BreadCrumbs/breadcrumbs";
import Footer from "@/common/LayoutNavigations/footer";
import Navbar from "../../../common/LayoutNavigations/navbar";
// Helper Import
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import CircularProgressBar from '@/common/CircularProcess/circularProgressBar';
import SpinnerProgress from '@/common/CircularProgressComponent/spinnerComponent';
// CSS Import
import styles from "../../../styles/sidebar.module.css";
import UserCSS from "../../../styles/user.module.css";
import { ToastContainer } from 'react-toastify';
import { userValidations } from '@/validation_schema/userValidation';
import { HandleRegister } from '@/services/auth';
// API services



export default function AddUser() {
  const router: any = useRouter();
  const [isLoadingButton, setLoadingButton] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(userValidations),
  });


  const onSubmit = async (event: any) => {
    setLoading(true);
    setLoadingButton(false)
    try {
      const res = await HandleRegister(event)
      setLoading(false);
      setTimeout(() => {
        router.push('/admin/users')
      }, 1000)
    } catch (e) {
      console.log(e)
      setLoadingButton(true)
    }
  };

  function ErrorShowing(errorMessage: any) {
    return (
      <Typography variant="body2" color={"error"} gutterBottom>
        {errorMessage}{" "}
      </Typography>
    );
  }

  return (
    <>
      <Navbar />
      <Box className={styles.combineContentAndSidebar}>
        <SideBar />
        <Box className={styles.siteBodyContainer}>
          {/* breadcumbs */}
          <BreadcrumbsHeading
            First="Home"
            Middle="User"
            Text="USER"
            Link="/admin/users"
          />
          {/* main content */}
          <Card>
            <CardContent>
              {!isLoading ?
                <Box
                  component="form"
                  method="POST"
                  noValidate
                  autoComplete="off"
                  onSubmit={handleSubmit(onSubmit)}
                  onReset={reset}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={12} lg={6} >
                      <Box component="img" src="/Images/pages/addFeature.jpg" width={'100%'} />
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={6} mt={10}>
                      <Typography className={UserCSS.InputLabelFont} mb={1}>ADD USER</Typography>

                      <Grid item xs={12} sm={12} md={12} lg={12} className={UserCSS.sessionNameGride} >
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                          <InputLabel className={UserCSS.InputLabelFont}>
                            First Name
                          </InputLabel>
                          <TextField
                            placeholder="First Name"
                            {...register("first_name")}
                          />
                          {errors && errors.first_name
                            ? ErrorShowing(errors?.first_name?.message)
                            : ""}
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={6}>
                          <InputLabel className={UserCSS.InputLabelFont}>
                            Last Name
                          </InputLabel>
                          <TextField
                            placeholder="Last Name"
                            {...register("last_name")}
                          />
                          {errors && errors.last_name
                            ? ErrorShowing(errors?.last_name?.message)
                            : ""}
                        </Grid>
                      </Grid>

                      <Grid item xs={12} sm={12} md={12} lg={12} className={UserCSS.sessionNameGride} >
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                          <InputLabel className={UserCSS.InputLabelFont}>
                            Email Id
                          </InputLabel>
                          <TextField
                            placeholder="Email Id"
                            {...register("email")}
                          />
                          {errors && errors.email
                            ? ErrorShowing(errors?.email?.message)
                            : ""}
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={6}>
                        <InputLabel className={UserCSS.InputLabelFont}>Role</InputLabel>
                          <Controller
                            name="role_id"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                              <FormControl fullWidth>
                                <Select {...field} displayEmpty>
                                  <MenuItem disabled value="">
                                    Role
                                  </MenuItem>
                                  <MenuItem value={1} >
                                    Admin
                                  </MenuItem>
                                  <MenuItem value={2}>
                                    Learner
                                  </MenuItem>
                                </Select>
                              </FormControl>
                            )}
                          />
                          {errors && errors.role_id
                            ? ErrorShowing(errors?.role_id?.message)
                            : ""}
                        </Grid>
                      </Grid>

                      <Grid item xs={12} sm={12} md={12} lg={12} textAlign={"right"} >
                        <Button className={UserCSS.cancelButton} variant="contained" size="large" onClick={() => router.push('/admin/users')} id={styles.muibuttonBackgroundColor}>Cancel</Button>
                        {!isLoadingButton ? <Button type="submit" size="large" variant="contained" id={styles.muibuttonBackgroundColor}>
                          Submit
                        </Button> : <LoadingButton loading={isLoadingButton} className={UserCSS.updateLoadingButton}
                          size="large" variant="contained" disabled >
                          <CircularProgressBar />
                        </LoadingButton>}
                      </Grid>
                    </Grid>

                  </Grid>
                </Box>
                : <SpinnerProgress />}
            </CardContent>
          </Card>
        </Box>
      </Box>
      {/* <Footer/> */}
      <ToastContainer />
    </>
  );
};


