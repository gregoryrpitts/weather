import React from "react";

import { useSnackbar, ProviderContext as INotiSnack, SnackbarKey, VariantType } from "notistack";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export const ERROR_NOTIFICATION_TYPE = "error";
export const INFO_NOTIFICATION_TYPE = "info";
export const SUCCESS_NOTIFICATION_TYPE = "success";
export const WARNING_NOTIFICATION_TYPE = "warning";
const AUTOHIDE_DURATION = 5000;

export interface IUseNotification {
  close: (key?: SnackbarKey | undefined) => void;
  enqueue: (msg: string, variant: VariantType) => SnackbarKey;
}
export type IUseNotificationExport = IUseNotification;

const useNotification = (): IUseNotification => {
  const { enqueueSnackbar, closeSnackbar }: INotiSnack = useSnackbar();

  const action = (snackbarId: SnackbarKey): React.ReactElement => {
    return (
      <React.Fragment>
        <IconButton
          aria-label={"delete"}
          color={"inherit"}
          onClick={() => {
            closeSnackbar(snackbarId);
          }}
        >
          <CloseIcon />
        </IconButton>
      </React.Fragment>
    );
  };

  const enqueue = (msg: string, variant: VariantType): SnackbarKey => {
    return enqueueSnackbar(msg, {
      variant: variant,
      autoHideDuration: AUTOHIDE_DURATION,
      action,
      anchorOrigin: {
        horizontal: "right",
        vertical: "bottom",
      },
    });
  };

  const close = (key?: SnackbarKey | undefined): void => {
    closeSnackbar(key);
  };

  return {
    close,
    enqueue,
  };
};

export default useNotification;
