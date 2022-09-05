import React, { useCallback, useEffect, useState } from "react";
import { AppBar, IconButton, Toolbar, Link } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import { useAppContext } from "src/core/store";
import { filter } from "rxjs";
import { useTranslation } from "react-i18next";

interface AppHeaderProps {
  brandName?: string;
  logo?: string;
}

const AppHeader = ({ brandName, logo }: AppHeaderProps) => {
  const { initialPageUrl } = useAppContext();
  const [shareLink, setShareLink] = useState("");
  const { t } = useTranslation();

  const shareLinkHandle = useCallback(() => {
    if (navigator.share && shareLink) {
      navigator
        .share({
          title: `${t("SharePopupTitle")}${shareLink}`,
          text: `${t("SharePopupText")}${shareLink}`,
          url: shareLink,
        })
        .then(() => {})
        .catch((err) => {});
    }
  }, [shareLink, t]);

  useEffect(() => {
    if (!!initialPageUrl) {
      const subscription = initialPageUrl
        .pipe(filter((link) => !!link))
        .subscribe((link) => {
          setShareLink(link);
        });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [initialPageUrl]);

  return (
    <AppBar
      position="fixed"
      sx={(theme) => ({
        zIndex: (theme) => theme.zIndex.modal + 1,
        ...theme.headerStyles.root,
      })}
      color="secondary"
    >
      <Toolbar sx={{ paddingLeft: "20px", paddingRight: "20px" }}>
        <Link
          sx={(theme) => ({ ...theme.headerStyles.logo })}
          href="/webar-internal"
        >
          <img
            style={{ height: "100%", width: "auto" }}
            src={logo}
            alt={brandName}
          />
        </Link>
        <IconButton
          onClick={() => shareLinkHandle()}
          sx={(theme) => ({
            marginLeft: "auto",
            p: 0,
            ...theme.headerStyles.iconButton,
          })}
        >
          <ShareIcon sx={{ width: "100%", height: "100%" }} />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
