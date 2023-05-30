// ** External Components
import { useEffect, useState } from "react";
import BreadcrumbsHeading from "@/common/BreadCrumbs/breadcrumbs";
import Navbar from "@/common/LayoutNavigations/navbar";
import SideBar from "@/common/LayoutNavigations/sideBar";
import { BASE_URL } from "@/config/config";
import SpinnerProgress from "@/common/CircularProgressComponent/spinnerComponent";

// ** MUI Imports
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  InputLabel,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import { LoadingButton } from "@mui/lab";
import CircularProgressBar from "@/common/CircularProcess/circularProgressBar";

// ** CSS Imports
import styles from "../../../styles/sidebar.module.css";
import siteStyles from "../../../styles/allConfigurations.module.css";
import { ToastContainer } from "react-toastify";

// ** React Imports
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// ** Types Imports
import { siteType } from "@/types/siteType";

// ** Service & Validation Imports
import { siteConfigValidations } from "@/validation_schema/configurationValidation";
import {
  HandleSiteConfigCreate,
  HandleSiteConfigUpdate,
  HandleSiteGetByID,
} from "@/services/site";
import { NextPageContext } from "next";
import Stripe from "./stripeConfiguration";

interface SiteConfigPageProps {
  siteConfigData: any; // Replace with the actual type of your site config data
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const SiteConfiguration = () => {
  const [previewProfile, setPreviewProfile] = useState<siteType>({
    org_logo: "",
    org_favicon: "",
  });
  const [isLoadingButton, setLoadingButton] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isAddOrEdit, setIsAddOrEdit] = useState<boolean>(false);
  const [portalData, setPortalData] = useState<siteType | any>("");
  const [tabs, setTab] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<siteType | any>({
    resolver: yupResolver(siteConfigValidations),
  });

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const onSubmit = async (event: any) => {
    const formData = new FormData();

    const reqData: any = {
      title: event.org_title,
      org_logo: event.org_logoo,
      org_favicon: event.org_favicoon,
    };

    for (var key in reqData) {
      formData.append(key, reqData[key]);
    }

    setLoadingButton(true);
    await HandleSiteConfigCreate(formData, "site saved")
      .then((res) => {
        setLoadingButton(false);
        handleGetDataById(res?.data?.user_id);
        setPreviewProfile({
          org_logo: "",
          org_favicon: "",
        });
        setIsAddOrEdit(true);
      })
      .catch((err) => {
        console.log(err);
        setLoadingButton(false);
      });
  };

  const handleChange = (e: any) => {
    const file = e.target.files[0];

    if (e.target.name === "org_logo") {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        setPreviewProfile({ ...previewProfile, org_logo: e.target.result });
        setValue("org_logoo", file);
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    } else if (e.target.name === "org_favicon") {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        setPreviewProfile({ ...previewProfile, org_favicon: e.target.result });
        setValue("org_favicoon", file);
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    }
  };

  function ErrorShowing(errorMessage: any) {
    return (
      <Typography variant="body2" color={"error"} gutterBottom>
        {errorMessage}{" "}
      </Typography>
    );
  }

  const handleGetDataById = async (userId: any) => {
    
    await HandleSiteGetByID(userId)
      .then((res) => {
        setLoading(false);
        if (res.data.length > 0) {
          const hasOLOrOFOrT = res.data.some(
            (item: any) =>
              item.key === "org_logo" ||
              item.key === "org_favicon" ||
              item.key === "title"
          );

          if (hasOLOrOFOrT) {
            setIsAddOrEdit(true);
          }
          const result = res.data.reduce((acc: any, { key, value }: any) => {
            acc[key] = value;
            return acc;
          }, {});
          setPortalData(result);
          localStorage.setItem("SiteConfig", JSON.stringify(result));

          res.data.filter((item: any) =>
            item.key === "org_logo"
              ? setValue("org_logoo", item.value)
              : item.key === "org_favicon"
              ? setValue("org_favicoon", item.value)
              : item.key === "title"
              ? setValue("org_title", item.value)
              : ""
          );
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    let localData: any;
    if (typeof window !== "undefined") {
      localData = window.localStorage.getItem("userData");
    }
    const user_id = JSON.parse(localData);
    setLoading(true);
    handleGetDataById(user_id?.id);
  }, []);

  const onUpdate = async (event: any) => {
    const reqData: any = {
      title: event?.org_title,
      org_logo: event?.org_logoo,
      org_favicon: event?.org_favicoon,
    };

    const formData: any = new FormData();
    for (var key in reqData) {
      formData.append(key, reqData[key]);
    }

    setLoadingButton(true);
    await HandleSiteConfigUpdate(formData, "site update")
      .then((res) => {
        setLoadingButton(false);
        handleGetDataById(res.data[0]?.user_id);
        setPreviewProfile({
          org_logo: "",
          org_favicon: "",
        });
      })
      .catch((err) => {
        console.log(err);
        setLoadingButton(false);
      });
  };

  return (
    <>
      <Navbar portalData={portalData} />
      <ToastContainer />
      <Box className={styles.combineContentAndSidebar}>
        <SideBar />

        <Box className={styles.siteBodyContainer}>
          {/* breadcumbs */}
          <BreadcrumbsHeading
            First="Home"
            Middle="Configuration"
            Text="CONFIGURATION"
            Link="/admin/configuration/"
          />

          {/* main content */}
          <Card>
            <CardContent>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={tabs}
                  onChange={handleChangeTab}
                  aria-label="basic tabs example"
                >
                  <Tab label="Organisation" className={styles.wholeWebsiteButtonColor} {...a11yProps(0)} />
                  <Tab label="Stripe" className={styles.wholeWebsiteButtonColor} {...a11yProps(1)} />
                </Tabs>
              </Box>
              <TabPanel value={tabs} index={0}>
                {!isLoading ? (
                  !isAddOrEdit ? (
                    // Save data in portal
                    <Box
                      component="form"
                      method="POST"
                      noValidate
                      autoComplete="off"
                      onSubmit={handleSubmit(onSubmit)}
                      onReset={reset}
                    >
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={12} md={12} lg={6}>
                          <Box
                            component="img"
                            src="/Images/pages/sideImages/siteSide.svg"
                            width={"100%"}
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={6}>
                          <Grid
                            item
                            xs={12}
                            sm={12}
                            md={12}
                            lg={12}
                            margin={"10px 0px 20px 0px"}
                          >
                            <InputLabel
                              shrink
                              htmlFor="org_title"
                              className={siteStyles.inputLabels}
                            >
                              Organisation Title
                            </InputLabel>
                            <TextField
                              fullWidth
                              id="org_title"
                              {...register("org_title")}
                              placeholder="Provide your organisation title"
                            />
                            {errors && errors.org_title
                              ? ErrorShowing(errors?.org_title?.message)
                              : ""}
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm={12}
                            md={12}
                            lg={12}
                            marginBottom={"20px"}
                          >
                            <InputLabel
                              shrink
                              htmlFor="org_llogo"
                              className={siteStyles.inputLabels}
                            >
                              Organisation Logo
                            </InputLabel>

                            {/* upload in db */}

                            <Box className={siteStyles.siteAttachmentBox}>
                              <InputLabel className={siteStyles.subbox}>
                                <TextField
                                  type="file"
                                  {...register("org_logo")}
                                  onChange={handleChange}
                                  sx={{ display: "none" }}
                                />
                                {previewProfile?.org_logo ? (
                                  <Box className={siteStyles.cameraIconMain}>
                                    <Box
                                      component={"img"}
                                      src={previewProfile?.org_logo}
                                      className={siteStyles.previewImage}
                                      width={"200px"}
                                    />
                                    <UploadIcon
                                      className={siteStyles.cameraAltIconLogo}
                                    />{" "}
                                  </Box>
                                ) : (
                                  <Typography
                                    className={siteStyles.siteAttachments}
                                  >
                                    {" "}
                                    <UploadIcon /> UPLOAD
                                  </Typography>
                                )}
                              </InputLabel>
                            </Box>
                            {previewProfile?.org_logo
                              ? ""
                              : errors && errors.org_logoo
                              ? ErrorShowing(errors?.org_logoo?.message)
                              : ""}
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm={12}
                            md={12}
                            lg={12}
                            marginBottom={"20px"}
                          >
                            <InputLabel
                              shrink
                              htmlFor="org_logo"
                              className={siteStyles.inputLabels}
                            >
                              Organisation Favicon
                            </InputLabel>
                            {/* upload in db */}

                            <Box className={siteStyles.siteAttachmentBox}>
                              <InputLabel className={siteStyles.subbox}>
                                <TextField
                                  type="file"
                                  {...register("org_favicon")}
                                  onChange={handleChange}
                                  sx={{ display: "none" }}
                                />
                                {previewProfile?.org_favicon ? (
                                  <Box className={siteStyles.cameraIconMain}>
                                    <Box
                                      component={"img"}
                                      src={previewProfile?.org_favicon}
                                      className={siteStyles.previewImage}
                                      width={"50px"}
                                    />
                                    <UploadIcon
                                      className={
                                        siteStyles.cameraAltIconFavicon
                                      }
                                    />{" "}
                                  </Box>
                                ) : (
                                  <Typography
                                    className={siteStyles.siteAttachments}
                                  >
                                    {" "}
                                    <UploadIcon /> UPLOAD
                                  </Typography>
                                )}
                              </InputLabel>
                            </Box>
                            {previewProfile?.org_favicon
                              ? ""
                              : errors && errors.org_favicoon
                              ? ErrorShowing(errors?.org_favicoon?.message)
                              : ""}
                          </Grid>

                          <Grid
                            item
                            xs={12}
                            sm={12}
                            md={12}
                            lg={12}
                            textAlign={"right"}
                          >
                            {!isLoadingButton ? (
                              <Button
                                type="submit"
                                size="large"
                                variant="contained"
                              >
                                Submit
                              </Button>
                            ) : (
                              <LoadingButton
                                loading={isLoadingButton}
                                size="large"
                                className={siteStyles.siteLoadingButton}
                                variant="contained"
                                disabled
                              >
                                <CircularProgressBar />
                              </LoadingButton>
                            )}
                          </Grid>
                        </Grid>
                      </Grid>
                    </Box>
                  ) : (
                    //  Show data from portal
                    <Box
                      component="form"
                      method="POST"
                      noValidate
                      autoComplete="off"
                      onSubmit={handleSubmit(onUpdate)}
                      onReset={reset}
                    >
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={12} md={12} lg={6}>
                          <Box
                            component="img"
                            src="/Images/pages/sideImages/siteSide.svg"
                            width={"100%"}
                          />
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={6}>
                          <Grid
                            item
                            xs={12}
                            sm={12}
                            md={12}
                            lg={12}
                            margin={"10px 0px 20px 0px"}
                          >
                            <InputLabel
                              shrink
                              htmlFor="org_title"
                              className={siteStyles.inputLabels}
                            >
                              Organisation Title
                            </InputLabel>
                            <TextField
                              fullWidth
                              id="org_title"
                              {...register("org_title")}
                              defaultValue={`${portalData.title}`}
                            />
                            {errors && errors.org_title
                              ? ErrorShowing(errors?.org_title?.message)
                              : ""}
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm={12}
                            md={12}
                            lg={12}
                            marginBottom={"20px"}
                          >
                            <InputLabel
                              shrink
                              htmlFor="org_llogo"
                              className={siteStyles.inputLabels}
                            >
                              Organisation Logo
                            </InputLabel>
                            <Box className={siteStyles.siteAttachmentBox}>
                              <InputLabel className={siteStyles.subbox}>
                                <TextField
                                  type="file"
                                  {...register("org_logo")}
                                  onChange={handleChange}
                                  sx={{ display: "none" }}
                                />
                                {previewProfile?.org_logo ? (
                                  <Box className={siteStyles.cameraIconMain}>
                                    <Box
                                      component={"img"}
                                      src={previewProfile?.org_logo}
                                      className={siteStyles.previewImage}
                                      width={"200px"}
                                    />
                                    <UploadIcon
                                      className={siteStyles.cameraAltIconLogo}
                                    />{" "}
                                  </Box>
                                ) : portalData?.org_logo ? (
                                  <Box className={siteStyles.cameraIconMain}>
                                    <Box
                                      component={"img"}
                                      src={
                                        BASE_URL + "/" + portalData?.org_logo
                                      }
                                      className={siteStyles.previewImage}
                                      width={"200px"}
                                    />
                                    <UploadIcon
                                      className={siteStyles.cameraAltIconLogo}
                                    />{" "}
                                  </Box>
                                ) : (
                                  <Typography
                                    className={siteStyles.siteAttachments}
                                  >
                                    {" "}
                                    <UploadIcon /> UPLOAD
                                  </Typography>
                                )}
                              </InputLabel>
                            </Box>
                            {previewProfile?.org_logo
                              ? ""
                              : errors && errors.org_logoo
                              ? ErrorShowing(errors?.org_logoo?.message)
                              : ""}
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm={12}
                            md={12}
                            lg={12}
                            marginBottom={"20px"}
                          >
                            <InputLabel
                              shrink
                              htmlFor="org_logo"
                              className={siteStyles.inputLabels}
                            >
                              Organisation Favicon
                            </InputLabel>
                            {/* upload in db */}

                            <Box className={siteStyles.siteAttachmentBox}>
                              <InputLabel className={siteStyles.subbox}>
                                <TextField
                                  type="file"
                                  {...register("org_favicon")}
                                  onChange={handleChange}
                                  sx={{ display: "none" }}
                                />
                                {previewProfile?.org_favicon ? (
                                  <Box className={siteStyles.cameraIconMain}>
                                    <Box
                                      component={"img"}
                                      src={previewProfile?.org_favicon}
                                      className={siteStyles.previewImage}
                                      width={"50px"}
                                    />
                                    <UploadIcon
                                      className={
                                        siteStyles.cameraAltIconFavicon
                                      }
                                    />{" "}
                                  </Box>
                                ) : portalData?.org_favicon ? (
                                  <Box className={siteStyles.cameraIconMain}>
                                    <Box
                                      component={"img"}
                                      src={
                                        BASE_URL + "/" + portalData?.org_favicon
                                      }
                                      className={siteStyles.previewImage}
                                      width={"50px"}
                                    />
                                    <UploadIcon
                                      className={
                                        siteStyles.cameraAltIconFavicon
                                      }
                                    />{" "}
                                  </Box>
                                ) : (
                                  <Typography
                                    className={siteStyles.siteAttachments}
                                  >
                                    {" "}
                                    <UploadIcon /> UPLOAD
                                  </Typography>
                                )}
                              </InputLabel>
                            </Box>
                            {previewProfile?.org_favicon
                              ? ""
                              : errors && errors.org_favicoon
                              ? ErrorShowing(errors?.org_favicoon?.message)
                              : ""}
                          </Grid>

                          <Grid
                            item
                            xs={12}
                            sm={12}
                            md={12}
                            lg={12}
                            textAlign={"right"}
                          >
                            {!isLoadingButton ? (
                              <Button
                                type="submit"
                                size="large"
                                variant="contained"
                              >
                                UPDATE
                              </Button>
                            ) : (
                              <LoadingButton
                                loading={isLoadingButton}
                                size="large"
                                className={siteStyles.siteLoadingButton}
                                variant="contained"
                                disabled
                              >
                                <CircularProgressBar />
                              </LoadingButton>
                            )}
                          </Grid>
                        </Grid>
                      </Grid>
                    </Box>
                  )
                ) : (
                  <SpinnerProgress />
                )}
              </TabPanel>
              <TabPanel value={tabs} index={1}>
                {/* <Stripe /> */}
              </TabPanel>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </>
  );
};

SiteConfiguration.getInitialProps = async (
  ctx: NextPageContext
): Promise<SiteConfigPageProps> => {
  // Fetch the site config data
  let user_id: any;

  let localData: any;
  if (typeof window !== "undefined") {
    localData = window.localStorage.getItem("userData");
  }
  if (localData) {
    user_id = JSON.parse(localData);
  }
  const siteConfigData = await HandleSiteGetByID(user_id?.id)
    .then((res) => {
      const result = res.data.reduce((acc: any, { key, value }: any) => {
        acc[key] = value;
        return acc;
      }, {});
      return result;
    })
    .catch((err) => {
      console.log(err);
    });
  return { siteConfigData };
};

export default SiteConfiguration;
