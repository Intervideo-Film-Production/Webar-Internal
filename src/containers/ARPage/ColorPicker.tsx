import styled from '@emotion/styled';
import { IconButton, Menu, MenuItem } from '@mui/material';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { PaletteIcon } from 'src/components/icons';
import { IProduct, IProductColor } from 'src/core/declarations/app';
import { ProductColorTypes } from 'src/core/declarations/enum';
import { useBoundStore } from 'src/core/store';

const ColorChangerIcon = styled.div({
	position: "relative",
	width: "36px",
	height: "36px",
	borderRadius: "50%",
	"&>*,::before,::after": {
		display: "inline-block",
		position: "absolute",
		width: "20px",
		height: "20px",
		borderRadius: "50%",
		transformOrigin: 'left center',
		left: "18px",
		top: "8px"
	},
	"&::before": {
		content: '""',
		border: '1px solid rgba(255,255,255,.6)',
		// border: '1px solid rgb(53, 46, 40)',
		background: "rgba(53, 46, 40, .5)",
		transform: 'rotate(0deg) translateX(-3px)'
	},
	"&::after": {
		content: '""',
		border: '1px solid rgba(255,255,255,.6)',
		// border: "1px solid rgb(119, 84, 52)",
		background: 'rgba(119, 84, 52, .5)',
		transform: 'rotate(90deg) translateX(-3px)'
	},
	"&>div:nth-of-type(1)": {
		border: '1px solid rgba(255,255,255,.6)',
		// border: "1px solid rgb(69, 32, 21)",
		background: 'rgba(69, 32, 21, .5)',
		transform: 'rotate(-90deg) translateX(-3px)'
	},
	"&>div:nth-of-type(2)": {
		border: '1px solid rgba(255,255,255,.6)',
		// border: "1px solid rgb(16, 15, 15)",
		background: 'rgba(16, 15, 15, .5)',
		transform: 'rotate(-180deg) translateX(-3px)'
	}
});

const ColorSelection = styled.span({
	margin: "5px",
	display: "inline-block",
	width: "30px",
	height: "30px",
	borderRadius: "50%",
	padding: "0px",
	border: "2px solid #fff",
});

interface IColorPickerProps {
	onSelectColor?: (color: IProductColor) => void;
}

const ColorPicker: React.FC<IColorPickerProps> = memo(({ onSelectColor }) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const arObjectColors = useBoundStore(state => state.product?.arObjectColors);

	useEffect(() => {
		// select first color by default
		if (!!onSelectColor && !!arObjectColors && !!arObjectColors[0]) onSelectColor(arObjectColors[0]);
	}, [onSelectColor])


	const colors = useMemo(() => {
		if (!arObjectColors) return [];
		const arrayColorList = new Array(Math.ceil(arObjectColors.length / 3))
			.fill(null)
			.map((_, i) => arObjectColors.slice(3 * i, 3 * i + 3));
		return arrayColorList;
	}, [arObjectColors]);

	useEffect(() => {
		console.log("colors", colors);
	}, [colors])

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<>
			{/* change beard color */}
			<IconButton
				app-locator="color-button"
				sx={{
					p: 0,
					zIndex: 2,
					width: '42px',
					height: '42px',
					position: "absolute",
					top: '-50px'
				}}
				onClick={handleClick}
			>
				<PaletteIcon sx={{ fontSize: '32px', fill: 'white', opacity: '.8' }} />
				{/* <ColorChangerIcon>
					<div></div>
					<div></div>
				</ColorChangerIcon> */}
				{/* <ColorSelection sx={{ background: beardColor }} /> */}
			</IconButton>

			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={open}
				PaperProps={{
					sx: {
						backgroundColor: "rgba(0,0,0,.5)",
					},
				}}
				anchorOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
				transformOrigin={{
					vertical: "bottom",
					horizontal: "right",
				}}
				onClose={handleClose}
				MenuListProps={{
					"aria-labelledby": "basic-button",
					sx: {
						p: 0,
					},
				}}
			>
				{/* FIXME need implementing colors */}
				{colors.map((subColors, arrIdx) => (
					<MenuItem
						sx={{
							padding: "5px",
							minHeight: "auto",
						}}
						disableRipple
						disableTouchRipple
						key={`itemList-${arrIdx}`}
					>
						{subColors.map((color, colorIdx) => (
							<ColorSelection
								key={`item-color-${arrIdx}-${colorIdx}`}
								style={
									(color.type === ProductColorTypes.pattern
										? { backgroundImage: `url("${color.icon}")` }
										: { background: color.value }
									)
								}
								onClick={() => {
									if (!!onSelectColor) onSelectColor(color);
									handleClose();
								}}
							/>
						))}
					</MenuItem>
				))}
			</Menu>
		</>
	)
})

export default ColorPicker;
