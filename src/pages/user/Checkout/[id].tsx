import * as React from 'react';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import WebViewNavbar from '@/common/LayoutNavigations/webviewnavbar';
import WebViewFooter from '@/common/LayoutNavigations/webviewfooter';
import { yupResolver } from '@hookform/resolvers/yup';
import { checkoutformtype } from '@/types/checkoutformtype';
import { CheckoutformvalidationStep } from '@/validation_schema/checkoutformvalidation';
import Grid from '@mui/material/Grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Box, Button, CircularProgress, Divider, InputLabel, OutlinedInput, Stack, Step, StepLabel, Stepper, Typography } from '@mui/material';
import styles from '../../../styles/webview.module.css'
import { useForm } from 'react-hook-form';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { GetSubsctionsPlansDet, HandleSubscriptionPayment } from '@/services/subscription';
import { useRouter } from "next/router";
import { HandleRegister } from '@/services/auth';
const defaultTheme = createTheme();

export default function Checkout() {
    const router: any = useRouter();
    const { id } = router.query;
    const [subscriptionplandet, setsubscriptionplandet] = React.useState<any>([]);
    const [spinner, setshowspinner] = React.useState(false);

    React.useEffect(() => {
        if (router.isReady) {
            getSubscribtion(id);
            router.push(`/user/Checkout//${id}`);
        }
    }, [router.isReady]);

    //get subscription
    const getSubscribtion = (id: any) => {
        GetSubsctionsPlansDet(id).then((subscdata) => {
            setsubscriptionplandet(subscdata)
        })
    }

    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { errors }, setError
    } = useForm<checkoutformtype | any>({
        resolver: yupResolver(CheckoutformvalidationStep),
    });
    const onSubmit = async (formvalue: any) => {
        setshowspinner(true);
        const data = {
            productName: subscriptionplandet.title,
            amount: subscriptionplandet.amount,
            quantity: 1
        };
        //user registration
        localStorage.setItem("user_email", formvalue.email)
        const reqData = {
            first_name: formvalue.firstname,
            last_name: formvalue.lastname,
            email: formvalue.email
        }
        userregister(reqData);
        //create payment
        HandleSubscriptionPayment(data).then((result) => {
            router.push(result);
        })
    }

    const userregister = async (formvalue: any) => {
        await HandleRegister(formvalue).then((res) => {
            if (res.status === 201) {
                console.log("user registration success");
            } else {
                console.log("email registred auto login");
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    function ErrorShowing(errorMessage: any) {
        return (
            <Typography variant="body2" color={"error"} sx={{ fontSize: "12px" }} gutterBottom>
                {errorMessage}{" "}
            </Typography>
        );
    }

    return (
        <>
            {/*header*/}
            < WebViewNavbar />
            <ThemeProvider theme={defaultTheme}>
                <Container component="form" maxWidth="md" sx={{ mb: 4 }}
                    method="POST"
                    noValidate
                    autoComplete="off"
                    onSubmit={handleSubmit(onSubmit)}
                    onReset={reset}>
                    <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 1, md: 2, } }}>
                        <Typography component="h1" variant="h4" align="center" mb={2}>
                            Checkout
                        </Typography>
                        <Divider light />
                        <Grid container spacing={3} mt={1}>
                            <Grid item xs={12} sm={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="fname">
                                        First Name <span className={styles.err_str}>*</span>
                                    </InputLabel>
                                    <OutlinedInput
                                        type="text"
                                        placeholder="First Name..."
                                        fullWidth
                                        size="small"
                                        {...register("firstname")}
                                    />
                                </Stack>
                                {errors && errors.firstname
                                    ? ErrorShowing(errors?.firstname?.message)
                                    : ""}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="lname">
                                        Last Name <span className={styles.err_str}>*</span>
                                    </InputLabel>
                                    <OutlinedInput
                                        type="text"
                                        id="name"
                                        placeholder="Last Name..."
                                        fullWidth
                                        size="small"
                                        {...register("lastname")}
                                    />
                                </Stack>
                                {errors && errors.lastname
                                    ? ErrorShowing(errors?.lastname?.message)
                                    : ""}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="email">
                                        Email  <span className={styles.err_str}>*</span>
                                    </InputLabel>
                                    <OutlinedInput
                                        type="text"
                                        placeholder="Email..."
                                        fullWidth
                                        size="small"
                                        {...register("email")}
                                    />
                                </Stack>
                                {errors && errors.email
                                    ? ErrorShowing(errors?.email?.message)
                                    : ""}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="number">
                                        Number <span className={styles.err_str}>*</span>
                                    </InputLabel>
                                    <OutlinedInput
                                        type="text"
                                        placeholder="Number..."
                                        fullWidth
                                        size="small"
                                        {...register("number")}
                                    />
                                </Stack>
                                {errors && errors.number
                                    ? ErrorShowing(errors?.number?.message)
                                    : ""}
                            </Grid>
                            {/* <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="add1">
                                        Address Line 1 <span className={styles.err_str}>*</span>
                                    </InputLabel>
                                    <OutlinedInput
                                        type="text"
                                        placeholder="Address 1..."
                                        fullWidth
                                        size="small"
                                        {...register("address1")}
                                    />
                                </Stack>
                                {errors && errors.address1
                                    ? ErrorShowing(errors?.address1?.message)
                                    : ""}
                            </Grid> */}
                            {/* <Grid item xs={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="add2">
                                        Address Line 2
                                    </InputLabel>
                                    <OutlinedInput
                                        type="text"
                                        placeholder="Address 2..."
                                        fullWidth
                                        size="small"
                                        {...register("address2")}
                                    />
                                </Stack>
                            </Grid> */}
                            <Grid item xs={12} sm={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="city">
                                        City  <span className={styles.err_str}>*</span>
                                    </InputLabel>
                                    <OutlinedInput
                                        type="text"
                                        placeholder="City..."
                                        fullWidth
                                        size="small"
                                        {...register("city")}
                                    />
                                </Stack>
                                {errors && errors.city
                                    ? ErrorShowing(errors?.city?.message)
                                    : ""}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="state">
                                        State/Province/Region <span className={styles.err_str}>*</span>
                                    </InputLabel>
                                    <OutlinedInput
                                        type="text"
                                        placeholder="State..."
                                        fullWidth
                                        size="small"
                                        {...register("state")}
                                    />
                                </Stack>
                                {errors && errors.state
                                    ? ErrorShowing(errors?.state?.message)
                                    : ""}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="country">
                                        Country <span className={styles.err_str}>*</span>
                                    </InputLabel>
                                    <OutlinedInput
                                        type="text"
                                        placeholder="Country..."
                                        fullWidth
                                        {...register("country")}
                                        size="small"
                                    />
                                </Stack>
                                {errors && errors.country
                                    ? ErrorShowing(errors?.country?.message)
                                    : ""}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="name">
                                        Zip / Postal code <span className={styles.err_str}>*</span>
                                    </InputLabel>
                                    <OutlinedInput
                                        type="text"
                                        id="name"
                                        placeholder="Postal Code..."
                                        fullWidth
                                        size="small"
                                        {...register("postalcode")}
                                    />
                                </Stack>
                                {errors && errors.postalcode
                                    ? ErrorShowing(errors?.postalcode?.message)
                                    : ""}
                            </Grid>

                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={<Checkbox color="secondary" name="saveAddress" value="yes" />}
                                    label="Use this address for payment details"
                                />
                            </Grid>
                        </Grid>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="contained"
                                sx={{ mt: 1, ml: 1, width: "200px" }}
                                type='submit'
                                endIcon={<CreditCardIcon />}
                            >
                                Process To Pay  {spinner === true ? <CircularProgress color="inherit" /> : ""}
                            </Button>
                        </Box>
                    </Paper>
                </Container>
            </ThemeProvider >
            {/*footer*/}
            < WebViewFooter />
        </>
    );
}