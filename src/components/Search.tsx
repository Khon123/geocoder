import React from "react";
import { Avatar, Stack } from "@mui/material";
import { styled, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import { Popover } from "@mui/material";
import { getSearchSvgUrl } from "../images";
import { Form, Field } from "react-final-form";
import { SearchField } from "./SearchField";
import { useSearchBase } from "../hooks/useSearchBase";
import * as helper from "../utils/helpers";
import SearchListItems from "./SearchListItems";
import useStates from "../hooks/useState";

export const Search = React.memo(({ map }: any) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SearchContent map={map} />
    </ThemeProvider>
  );
});

const SearchContent = React.memo(({ map }: any) => {
  const [state, setState]: any = useStates({
    isFocus: false,
    loadMore: false,
    loading: false,
    results: undefined,
    pageInfo: undefined,
  });
  const { isFocus, loadMore, loading, results, pageInfo } = state;
  const {
    fetchAPINext,
    onSearch,
    onSelectedItem,
    onSubmit,
    onClearData,
    onClickLocation,
  }: any = useSearchBase({ map, state, setState });

  React.useEffect(() => {
    setState({
      pageInfo,
      results,
    });
  }, [isFocus, loading]);

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const onActive = React.useCallback((action: boolean) => {
    setState({ isFocus: action });
  }, []);

  const handleClear = () => {
    setState({ results: undefined, pageInfo: undefined });
  };
  const handleOnChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value }: any = e.currentTarget;
      onSearch(value);
      if (helper.isLatLonText(value)) {
        setState({ results: undefined, pageInfo: undefined });
      }
      if (value === "") {
        handleClear();
        // helper.removeMapLayer(map);
      }
    },
    []
  );

  const hasMore =
    pageInfo && !(pageInfo?.current_page === pageInfo?.total_pages);

  const fetchMoreData = async () => {
    if (!hasMore) return;
    const { per_page, current_page, q } = pageInfo;
    try {
      const res = await fetchAPINext({ q, per_page, page: current_page + 1 });
      setState({
        pageInfo: res?.pageInfo || {},
        results: results.concat(res.results),
      });
    } catch (err) {
      console.log("====::: ", err);
    }
  };

  const handleClearData = (form: any) => {
    onClearData(form);
    handleClear();
    helper.removeMapLayer(map);
  };

  return (
    <div>
      <StyledAvatar onClick={handleClick} src={getSearchSvgUrl} />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        sx={{
          "&.MuiPopover-root": {
            left: "6.2px",
            top: "-5.8px",
          },
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <StyledWrapper width={250}>
          <Form onSubmit={onSubmit}>
            {({ handleSubmit, values, form }) => (
              <form onSubmit={handleSubmit}>
                <Stack flex="1" direction="row" className="search-wrapper">
                  <Field
                    name="search"
                    fullWidth
                    placeholder="Search..."
                    component={SearchField}
                    onChange={handleOnChange}
                    onActive={onActive}
                    onClose={() => handleClearData(form)}
                  />
                </Stack>
                {isFocus && (
                  <SearchListItems
                    results={results}
                    form={form}
                    search={values.search}
                    onSelect={onSelectedItem}
                    onMoreData={fetchMoreData}
                    onLocation={onClickLocation}
                    hasMore={hasMore}
                    loadMore={loadMore}
                    loading={loading}
                  />
                )}
              </form>
            )}
          </Form>
        </StyledWrapper>
      </Popover>
    </div>
  );
});
const StyledWrapper = styled(Stack)`
  && {
    form {
      .search-wrapper {
        border-bottom: 1px solid rgb(133, 133, 133, 0.3);
        border-radius: 2px;
      }
    }
    .MuiTextField-root {
      flex: 1;
      border-radius: 2px;
    }
    #id-search-field {
      padding: 8px 0px 8px 8px;
      font-size: 14px;
    }
    .MuiInputBase-root {
      border-radius: 0;
      padding-right: 4px;
    }

    .close-icon {
      font-size: 18px;
    }
  }
`;

const StyledAvatar = styled(Avatar)`
  && {
    padding: 2px;
    width: 29px;
    height: 29px;
    cursor: pointer;
    .MuiAvatar-img {
      width: 80%;
      height: 80%;
    }
  }
`;
