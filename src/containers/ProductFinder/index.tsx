import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
	Grid,
	Typography,
	Box,
	Link,
	List,
	ListItemButton,
	Toolbar
} from '@mui/material';
// @ts-ignore
// import SwipeableViews from "react-swipeable-views";
import { useTranslation } from 'react-i18next';
import { AppGrid } from '../../components';
import { LoadingBox, AppButton, TabPanel, CompareProductContent } from 'src/components';
import { useNavigate } from 'react-router-dom';
import { ProductFinderSettingIcon, AppArrowLeftSquareIcon } from 'src/components/icons';
import { IProduct, ISearchCriteria, ISearchCriteriaValue } from 'src/core/declarations/app';
import { deepCopyObject, sortFunction } from 'src/core/helpers';
import ModifySettingDrawer from './ModifySettingDrawer';
import {
	useLocation
} from 'react-router-dom';
import queryString from "query-string";
import { StoreStatus } from 'src/core/declarations/enum';
import { useBoundStore } from 'src/core/store';
const isMultipleChoicesAnswerChecked = (answers: { questionId: string, answerId: string | string[] }[], q: ISearchCriteria, aId: string) => {
	if (!q.isMultipleChoices) return false;
	const answer = answers.find(qa => qa.questionId === q.id);
	if (!answer) return false;
	return (answer.answerId as string[]).includes(aId);
}

const getAnswer = (answers: ISearchCriteriaValue[] | null, answerId: string | string[]) => {
	if (Array.isArray(answerId)) {
		return answerId.map(aId => answers?.find(ans => ans.id === aId)?.answer || '').filter(v => v !== '').join('/');
	}
	return answers?.find(ans => ans.id === answerId)?.answer;
}

const ProductFinderPage = () => {
	const [activeStep, setActiveStep] = useState('');
	const [trackStep, setTrackStep] = useState('');
	const [modifySettingOpen, setModifySettingOpen] = useState(false);
	const [selectedAnswers, setSelectedAnwsers] = useState<{ questionId: string, answerId: string | string[] }[]>([]);
	const [lastQuestion, setLastQuestion] = useState<ISearchCriteria | null>(null);
	const { t, i18n } = useTranslation();
	const breadcrumnbsRef = useRef<HTMLUListElement | null>(null);
	const navigate = useNavigate();
	const storeData = useBoundStore(state => state.store);
	const location = useLocation();
	let { showFullList, cat } = queryString.parse(location.search) as { showFullList: string, cat: string }; // FIXME should be boolean

	const {
		searchCriteria,
		searchCriteriaStatus,
		getSearchCriteria,
		searchCriteriaValue,
		searchCriteriaValueStatus,
		getSearchCriteriaValue
	} = useBoundStore((state) =>
	({
		searchCriteria: state.searchCriteria,
		searchCriteriaStatus: state.searchCriteriaStatus,
		getSearchCriteria: state.getSearchCriteria,
		searchCriteriaValue: state.searchCriteriaValue,
		searchCriteriaValueStatus: state.searchCriteriaValueStatus,
		getSearchCriteriaValue: state.getSearchCriteriaValue
	}));

	useEffect(() => {
		getSearchCriteria(i18n.language);
		getSearchCriteriaValue(i18n.language);
	}, [i18n.language, getSearchCriteria, getSearchCriteriaValue]);

	const { searchProducts, searchProductsStatus, findMatchingProducts, setProduct } = useBoundStore(state => ({
		searchProducts: state.searchProducts,
		searchProductsStatus: state.searchProductsStatus,
		findMatchingProducts: state.findMatchingProducts,
		setProduct: state.setProduct
	}));

	const findMatchingProductsQuery = useCallback(() => {
		if (!storeData?.id) return;
		findMatchingProducts(selectedAnswers, i18n.language, storeData?.id, cat);
	}, [findMatchingProducts, selectedAnswers, i18n.language, storeData?.id, cat])

	const handleModifySettingClose = (modifiedSettings?: { questionId: string, answerId: string | string[] }[]) => {
		setModifySettingOpen(false);
		if (!!modifiedSettings) {
			setSelectedAnwsers(modifiedSettings);
			setLastQuestion(null);
		}
	}

	useEffect(() => {
		if (!!breadcrumnbsRef) {
			const stepToTrack = breadcrumnbsRef?.current?.querySelector(`#breadcrums-item-${trackStep}`);
			if (!!stepToTrack) {
				const stepPos = stepToTrack.getBoundingClientRect();
				const childTranslateLeft = (document.documentElement.clientWidth - stepPos.width) / 2;
				const parentTranslateLeft = childTranslateLeft - (stepToTrack as HTMLElement).offsetLeft;

				if (!!breadcrumnbsRef.current) {
					(breadcrumnbsRef.current as HTMLElement).setAttribute('style', `transform: translateX(${parentTranslateLeft}px)`)
				}
			}
		}

	}, [trackStep])

	const firstQuestion = useMemo(() => {
		// if users want fullist simply put firstquetion to null to ignore applying search questions params in API
		return !!showFullList
			? null
			: !!storeData?.firstQuestion
				? !!searchCriteria
					? searchCriteria.find(q => q.id === storeData?.firstQuestion?._ref) || null
					: undefined
				: null;
	}, [searchCriteria, storeData, showFullList])

	useEffect(() => {
		if (selectedAnswers.length > 0 && !lastQuestion) {
			findMatchingProductsQuery();
		};

		if (lastQuestion && lastQuestion.isSearchable && !lastQuestion.isMultipleChoices && lastQuestion.id === activeStep) {
			findMatchingProductsQuery();
		}
	}, [selectedAnswers, lastQuestion, activeStep, findMatchingProductsQuery])

	const questions: (ISearchCriteria & { answers: ISearchCriteriaValue[] })[] | null = useMemo(() => {
		if (!!searchCriteria && !!searchCriteriaValue) {
			return searchCriteria.map((cr, crIdx) => ({
				...cr,
				answers: searchCriteriaValue.filter(crVal => crVal.criteriaRef === cr.id)
			}))
		} else {
			return null;
		}

	}, [searchCriteria, searchCriteriaValue])

	useEffect(() => {
		if (firstQuestion === null) {
			findMatchingProductsQuery();
		} else if (firstQuestion !== undefined) {
			setActiveStep(firstQuestion.id);
		}
	}, [firstQuestion, findMatchingProductsQuery])

	const handleSelectProduct = (product: IProduct) => {
		setProduct(product);
		navigate('/ar-page');
	}

	const handleBackToStart = () => {
		setSelectedAnwsers([]);
		setLastQuestion(null);
		setTrackStep(activeStep);
		setActiveStep(firstQuestion?.id || '');
	}

	const handleChangeSetting = () => {
		setModifySettingOpen(true);
	}

	const handleAnswerNav = (questionId: string) => {
		setTrackStep(questionId);
		setActiveStep(questionId);
	}

	const handleNext = (q: ISearchCriteria, ans: ISearchCriteriaValue) => {
		// check answer & set answer
		let answers = selectedAnswers;
		const answerIdx = answers.findIndex(sa => sa.questionId === q.id);
		if (answerIdx < 0) {
			// answer not exist => add new answer
			setLastQuestion(q);

			setSelectedAnwsers(deepCopyObject(answers.concat([{
				questionId: q.id,
				// if is a multiple choices question should be a list of anwser ids
				answerId: q.isMultipleChoices ? [ans.id] : ans.id
			}])));


		} else {
			// answer exists => adjust answer
			if (q.isMultipleChoices && Array.isArray(answers[answerIdx].answerId)) {
				const ansArr = answers[answerIdx].answerId as string[];
				if (ansArr.includes(ans.id)) {
					// if answer was selected => unselect
					answers[answerIdx].answerId = ansArr.filter(a => a !== ans.id);
				} else {
					answers[answerIdx].answerId = ansArr.concat([ans.id]);
				}
			} else {
				answers[answerIdx].answerId = ans.id;
			}
			setLastQuestion(q);

			setSelectedAnwsers(deepCopyObject(answers));
		}

		// check next destination
		if (!!ans.destination && questions) {
			const nextQuestion = questions.find(q => q.id === ans.destination);
			if (!!nextQuestion) {
				setTrackStep(activeStep);
				setActiveStep(nextQuestion.id);

				return;
			}
		}
	};

	const pageLoading = useMemo(() => {
		return searchCriteriaStatus === StoreStatus.loading
			|| searchCriteriaValueStatus === StoreStatus.loading
			|| searchProductsStatus === StoreStatus.loading;
	}, [searchCriteriaStatus, searchCriteriaValueStatus, searchProductsStatus]);

	if (pageLoading) {
		return <LoadingBox sx={{ height: '100%' }} />;
	}

	return (
		<AppGrid sx={{
			flexGrow: 1,
			bgcolor: '#FFF',
			height: 'calc(100% - 76px)',
			display: 'flex',
			flexDirection: 'column',
			overflow: 'hidden',
		}}>
			<Toolbar />
			<AppButton
				variant="contained"
				sx={theme => ({ ...theme.productFinderStyles?.backToScannerButton })}
				onClick={() => {
					navigate('/scan-page');
					setSelectedAnwsers([]);
				}}
				startIcon={<AppArrowLeftSquareIcon sx={{ fontSize: '1.25rem' }} />}
			>
				{t('ProductFinderBackButtonText')}
			</AppButton>

			{searchProductsStatus === StoreStatus.empty
				? (<>

					<Grid sx={{
						position: 'relative',
						display: 'flex',
					}}>
						{selectedAnswers.length > 0
							&& (
								<>
									<List ref={breadcrumnbsRef} sx={{
										display: 'inline-flex',
										flexWrap: 'nowrap',
										py: 0,
										transition: selectedAnswers.length < 2 ? 'none' : 'all ease-in-out 300ms'
									}}
									>
										{selectedAnswers.map((sa, saIdx) =>
										(
											<ListItemButton
												id={`breadcrums-item-${sa.questionId}`}
												sx={{
													py: 0,
													px: theme => `calc(${theme.spacing(1)} / 2)`
												}}
												onClick={() => handleAnswerNav(sa.questionId)}
												key={`breadcrumnbs-answer-nav-${saIdx}`}>
												<Typography sx={{
													whiteSpace: 'nowrap',
													color: '#797979',
													opacity: sa.questionId === trackStep ? 1 : .5
												}}>{getAnswer(searchCriteriaValue, sa.answerId)}</Typography>
											</ListItemButton>))}
									</List>
								</>
							)}
					</Grid>

					{questions && questions.map((q, qIdx) => (
						<TabPanel
							style={{ display: 'grid', flexGrow: 1 }}
							key={`search-criteria-${qIdx}`}
							value={activeStep}
							index={q.id}>
							<Grid sx={{
								mb: 1,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								flexDirection: 'column'
							}}>
								<Typography variant="h4" style={{ color: "black", whiteSpace: 'pre-line' }} gutterBottom>
									{q.question}
								</Typography>
								<Box sx={{
									maxWidth: '265px'
								}}>
									{q.answers.map((ans, ansIdx) => (
										<AppButton
											fullWidth
											key={`answer-${ansIdx}`}
											size="large"
											hasBoxShadow
											variant="contained"
											sx={theme => ({
												...theme.productFinderStyles?.answerButtons,
												...(isMultipleChoicesAnswerChecked(selectedAnswers, q, ans.id) && { ...theme.productFinderStyles?.multipleChoicesAnswerButtons })
											})}
											onClick={() => handleNext(q, ans)}
										>
											{ans.answer}
										</AppButton>
									))}

									{q.isMultipleChoices && (
										<AppButton
											fullWidth
											variant="contained"
											size="large"
											sx={theme => ({ ...theme.productFinderStyles?.showResultsButton })}
											onClick={() => { findMatchingProductsQuery(); }}>
											{t('ProductFinderShowResultButtonText')}
										</AppButton>)}
								</Box>


							</Grid>
						</TabPanel>
					))}</>)

				: (<Grid sx={{
					display: 'grid',
					gridTemplateRows: firstQuestion ? 'auto 3fr 1fr' : 'auto 3fr 30px',
					height: '100%',
					overflowY: 'auto',
					px: 2
				}}>
					{/* FIXME  */}
					<Typography sx={{
						margin: '2rem 0px 1rem',
						fontWeight: 700
					}} variant="h3" color="primary">{t('ProductFinderResultTitle')}:</Typography>

					<Grid sx={{
						display: 'grid',
						gridTemplateColumns: '1fr 1fr',
						gridTemplateRows: 'min-content',
						placeItems: 'stretch',
						gridGap: '1rem',
						overflowY: 'auto'
					}}>
						{searchProducts && searchProducts.length > 0
							? (<>{searchProducts.sort(sortFunction).map((p, idx) =>
							(
								<Grid
									sx={{ width: '100%' }}
									key={`found-product-${idx}`}
								>
									<Link sx={{
										width: '100%',
										paddingBottom: '100%',
										position: 'relative',
										display: 'inline-block',
									}}
										onClick={() => { handleSelectProduct(p) }}
									>
										<CompareProductContent
											sx={{
												position: 'absolute',
												left: 0,
												top: 0
											}}
											product={p}
										>
											<Typography sx={{
												color: "#fff",
												position: 'absolute',
												p: 0,
												fontWeight: 700,
												fontSize: '0.625rem',
												textDecoration: 'underline',
												bottom: theme => theme.spacing(1),
												right: theme => theme.spacing(1),
											}}>{t('ProductFinderViewInARText')}</Typography>
										</CompareProductContent>
									</Link>
								</Grid>
							))}</>)
							: (<Typography sx={{ gridColumn: '1/3' }} color="primary">{t('ProductFinderNoResultText')}</Typography>)}

					</Grid>

					{firstQuestion && (<Grid sx={{
						display: 'flex',
						justifyContent: 'space-between',
						width: '100%',
						mt: 2,
						alignItems: 'flex-start'
					}}>
						<AppButton
							startIcon={<AppArrowLeftSquareIcon sx={{ width: "20px", height: "20px", marginRight: "6px" }} />}
							variant="contained"
							size="small"
							onClick={() => { handleBackToStart() }}
							sx={theme => ({ ...theme.productFinderStyles?.backToStartButton })}
						>{t('ProductFinderBackToStartButtonText')}</AppButton>
						<AppButton
							variant="contained"
							size="small"
							sx={theme => ({ ...theme.productFinderStyles?.changeSettingsButton })}
							onClick={() => { handleChangeSetting(); }}
							endIcon={<ProductFinderSettingIcon sx={{ width: "20px", height: "20px", marginLeft: "6px" }} />}
						>{t('ProductFinderChangeSettingButtonText')}</AppButton>
					</Grid>)}
				</Grid>)}

			<ModifySettingDrawer
				open={modifySettingOpen}
				questions={questions}
				selectedAnswers={selectedAnswers}
				onClose={modifiedSettings => handleModifySettingClose(modifiedSettings)}
			/>
		</AppGrid>
	)
}

export default ProductFinderPage;
