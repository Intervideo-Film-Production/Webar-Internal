
import { Grid, Typography } from '@mui/material';
import React from 'react';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

// FIXME need data
const AllowScanPage = () => {
	const { t } = useTranslation();
	const history = useHistory();

	return (
		<>
			<Grid
				container
				justifyContent="center"
				alignItems="center"
				sx={{
					position: "relative"
				}}
			>
				<img
					src="./imgs/image-content.png"
					alt="allow-permissions"
				/>
				<Grid sx={{
					display: 'grid',
					alignContent: 'flex-start',
					position: 'absolute',
					bottom: 0,
					left: 0,
					right: 0,
					background: "#fff",
					pt: 3,
					pb: 7
				}}>
					<Typography variant="h3" sx={{
						px: 1,
						mb: 7,
						fontSize: '2rem',
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
							onClick={() => { history.push('/'); }}

						>{t("AllowScanPageCancelButton")}</Button>
						<Button variant="contained" style={{ borderRadius: 0, width: "40%" }}
							onClick={() => { history.push('/scan-page'); }}

						>{t("AllowScanPageAllowButton")}</Button>
					</Grid>
				</Grid>
			</Grid>
		</>
	)
}

export default AllowScanPage;
