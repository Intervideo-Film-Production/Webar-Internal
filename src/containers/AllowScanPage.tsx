
import { Grid, Toolbar, Typography } from '@mui/material';
import React from 'react';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import queryString from 'query-string';

// FIXME need data
const AllowScanPage = () => {
	const { t } = useTranslation();
	const location = useLocation();
	const { showArPage } = queryString.parse(location.search) as { showArPage: boolean | null };
	const navigate = useNavigate();

	return (
		<>
			<Grid
				container
				justifyContent="center"
				alignItems="center"
				sx={{
					position: "relative",
					height: "100%",
					overflow: 'hidden'
					// backgroundImage: "url(./imgs/allow-scan.jpg)",
					// backgroundSize: "auto 85%",
					// backgroundRepeat: "no-repeat",
					// backgroundPosition: "73%"
				}}
			>
				<Toolbar />
				<img
					style={{
						height: 'calc(100% - 56px)',
						width: 'auto',
						transform: 'translateX(-13%)'
					}}
					// src="./imgs/image-content.png"
					src="./imgs/allow-scan.jpg"
					alt="allow-permissions"
				/>
				<Grid sx={{
					display: 'grid',
					alignContent: 'flex-start',
					position: 'absolute',
					bottom: 0,
					left: '20px',
					right: '20px',
					background: "rgba(255,255,255,.8)",
					pt: 3,
					pb: 3
				}}>
					<Typography variant="h3" sx={{
						px: 1,
						mb: 7,
						fontWeight: 600,
						color: theme => theme.palette.text.secondary,
						textAlign: 'center'
					}}>
						{t("AllowScanPageDeviceMotionAccess")}
					</Typography>
					<Grid container columns={16} sx={{
						display: 'flex',
						alignContent: 'flex-start',
						justifyContent: "space-around",

					}}>
						<Button variant="outlined" style={{ borderRadius: 0, width: "40%" }}
							onClick={() => { navigate('/'); }}

						>{t("AllowScanPageCancelButton")}</Button>
						<Button variant="contained" style={{ borderRadius: 0, width: "40%" }}
							onClick={() => {
								navigate(showArPage ? '/ar-page' : '/scan-page');
							}}

						>{t("AllowScanPageAllowButton")}</Button>
					</Grid>
				</Grid>
			</Grid>
		</>
	)
}

export default AllowScanPage;
