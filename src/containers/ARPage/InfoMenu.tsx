import { Grid, Button, Modal, IconButton, Box, ButtonProps, Typography, List, ListItemButton } from '@mui/material';
import React, { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { InfoIcon, LanguageIcon } from 'src/components/icons';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { TabPanel } from 'src/components';
import { useAppContext } from 'src/core/events';
import { useBoundStore } from 'src/core/store';

interface IinfoMenuProps {
	open: boolean;
	onClose?: () => void;
	// check header component height to render modal correctly
	headlineHeight?: number;

}

const tabPanelStyle: React.CSSProperties = {
	display: 'grid',
	overflowY: 'hidden'
};

const InfoButton = ({ children, ...rest }: ButtonProps) => (<Button
	variant="text"
	{...rest}
	sx={theme => ({ ...theme.arPageStyles?.infoMenu.menuButton })}
>	{children}</Button>)

const InfoMenu = memo(({ open, onClose, headlineHeight }: IinfoMenuProps) => {
	const { appTheme } = useAppContext();
	const { t, i18n } = useTranslation();
	const [tabPanel, setTabPanel] = useState(0);

	const supportedLanguages = useBoundStore(state => state.languages);
	const {
		product,
		store,
		getById,
		getButtonContents,
		getSearchCriteria,
		getSearchCriteriaValue
	} = useBoundStore(state => ({
		product: state.product,
		store: state.store,
		getById: state.getById,
		getButtonContents: state.getButtonContents,
		getSearchCriteria: state.getSearchCriteria,
		getSearchCriteriaValue: state.getSearchCriteriaValue
	}));

	const handleClose = () => {
		if (onClose) onClose();
		setTabPanel(0);
	};

	const switchLanguageHandle = (lng: string) => {
		i18n.changeLanguage(lng, (err) => {
			if (err) {
				console.error("an error when trying to change language");
				return;
			}

			// refetch all data
			if (!!product?.id && !!store?.id) {
				getById(product.id, lng, store.id);
				getButtonContents(product.id, lng);
				getSearchCriteria(lng);
				getSearchCriteriaValue(lng);
			}
		});
		handleClose();
	}

	return (
		<Modal
			open={open}
			BackdropProps={{
				sx: {
					background: 'transparent'
				}
			}}
			onClose={handleClose}
		>
			<Box sx={{
				position: 'absolute',
				display: 'grid',
				gridTemplateRows: '1fr auto',
				top: `${
					// header height
					56
					// product claim height
					+ (headlineHeight || 0)
					// margin top
					+ 20
					}px`,
				left: '20px',
				padding: "10px 15px 15px",
				borderRadius: "5px",
				maxWidth: 'calc(100vw - 40px)',
				maxHeight: `calc(100% - ${headlineHeight || 0}px - 116px)`, // minus header height, headline height, consent height, and padding,
				...appTheme.getValue().arPageStyles?.infoMenu.root
			}}>
				<Grid sx={{ display: "flex", justifyContent: "space-between", alignItems: 'center' }}>
					{tabPanel === 0
						? (<InfoIcon sx={theme => ({ ...theme.arPageStyles?.infoMenu.navigationIcons })} />)
						: (<IconButton
							onClick={() => { setTabPanel(0) }}
							sx={{ p: 0 }}
						><ArrowBackIosIcon sx={theme => ({ fontSize: '20px', ...theme.arPageStyles?.infoMenu.navigationIcons })} /></IconButton>)}

					<IconButton sx={{ p: 0 }} onClick={handleClose}>
						<CloseIcon
							sx={theme => ({ ...theme.arPageStyles?.infoMenu.navigationIcons })}
						// style={{ ...appTheme.getValue().arPageStyles?.infoMenu.navigationIcons }}
						/>
					</IconButton>
				</Grid>
				<TabPanel value={tabPanel} index={0} style={{ ...tabPanelStyle }}>
					<Grid sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'flex-start'
					}}>
						<InfoButton
							onClick={() => { setTabPanel(1) }}
						>{t('InfoDialogHelpButtonText')}</InfoButton>
						<InfoButton
							onClick={() => { setTabPanel(2) }}
							endIcon={<LanguageIcon sx={theme => ({ ...theme.arPageStyles?.infoMenu.navigationIcons })} />}
						>{t('InfoDialogLanguageButtonText')}</InfoButton>
					</Grid>
				</TabPanel>

				<TabPanel value={tabPanel} index={1} style={{ ...tabPanelStyle, width: 'calc(100vw - 70px)' }}>
					<Typography variant="h5" sx={theme => ({ ...theme.arPageStyles?.infoMenu.tabTitle })}>{t('InfoDialogHowToTitle')}</Typography>
					<Typography sx={theme => ({ whiteSpace: 'pre-line', overflowY: 'auto', ...theme.arPageStyles?.infoMenu.tabContent })}>{t('InfoDialogHowToText')}</Typography>
				</TabPanel>

				<TabPanel value={tabPanel} index={2} style={{ ...tabPanelStyle, width: 'calc(100vw - 70px)' }}>
					<Typography variant="h5" sx={theme => ({ ...theme.arPageStyles?.infoMenu.tabTitle })}>{t('InfoDialogChooseLanguageButtonText')}</Typography>
					<List sx={{ overflowY: 'auto' }}>
						{supportedLanguages && supportedLanguages.map((lng, idx) => (
							<ListItemButton
								onClick={() => switchLanguageHandle(lng.code)}
								key={`lng-${idx}`}
								disableGutters
								sx={theme => ({ ...theme.arPageStyles?.infoMenu.languageOption })}
							>
								{lng.name}
							</ListItemButton >))}
					</List>
				</TabPanel>
			</Box>
		</Modal>
	)
});

export default InfoMenu;
