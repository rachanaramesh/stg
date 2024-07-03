import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import {
    DataGrid,
    GridColDef,
    GridActionsCellItem,
    GridRowId,
    GridRowModel,
} from '@mui/x-data-grid';
import Snackbar from '@mui/material/Snackbar';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import * as moment from 'moment'
import { useAxiosFetch } from '../service/RestService';
import Alert, { AlertProps } from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import { Dispatch } from "redux"
import { useDispatch } from "react-redux"

type Props = {
    updateLocationCount: (locations: ILocation[]) => void
}


export const FullFeaturedCrudGrid: React.FC<Props> = ({ updateLocationCount }) => {
    const dispatch: Dispatch<any> = useDispatch()
    const [rowData, setData] = React.useState<any>([]);
    const [promiseArguments, setPromiseArguments] = React.useState<any>(null);
    const [snackbar, setSnackbar] = React.useState<Pick<
        AlertProps,
        'children' | 'severity'
    > | null>(null);

    const { fetch, put, delete: deleteOperation } = useAxiosFetch<any>();

    React.useEffect(() => {
        loadData();
    }, []);

    React.useEffect(() => {
        if (fetch.data) {
            setData(fetch.data);
            locationCount(fetch.data);
        }
    }, [JSON.stringify(fetch.data)]);

    const updateData = React.useCallback(
        (locations: ILocation[]) => dispatch(updateLocationCount(locations)),
        [dispatch, updateLocationCount]
    )

    const locationCount = (data: any[]) => {
        let locationCount: ILocation[] = [];
        data.forEach((row) => {
            let index = locationCount.findIndex((element) => element.location === row.location);
            if (index >= 0) {
                locationCount[index].count = locationCount[index].count + 1;
            } else {
                locationCount.push({ count: 1, location: row.location });
            }
        })
        updateData(locationCount);
    }

    const handleCloseSnackbar = () => setSnackbar(null);

    const loadData = () => {
        fetch.fetchData({ method: 'GET', url: '/users' });
    }

    const handleDeleteClick = (id: GridRowId) => async () => {
        try {
            await deleteOperation.deleteData(`/users/${id}`);
            let newData = rowData.filter((row: { id: GridRowId; }) => row.id !== id);
            setData(newData);
            locationCount(newData);
            setSnackbar({ children: 'User deleted successfully', severity: 'success' });
        } catch (error) {
            setSnackbar({ children: 'Error in deleting Data', severity: 'error' });
        }
    };

    function computeMutation(newRow: GridRowModel, oldRow: GridRowModel) {
        if (newRow.location !== oldRow.location) {
            return `Location changed from '${oldRow.location}' to '${newRow.location}'.`;
        }
        return null;
    }

    const processRowUpdate = React.useCallback(
        (newRow: GridRowModel, oldRow: GridRowModel) =>
            new Promise<GridRowModel>((resolve, reject) => {
                const mutation = computeMutation(newRow, oldRow);
                if (mutation) {
                    setPromiseArguments({ resolve, reject, newRow, oldRow });
                } else {
                    resolve(oldRow);
                }
            }),
        [],
    );

    const handleNo = () => {
        const { oldRow, resolve } = promiseArguments;
        resolve(oldRow);
        setPromiseArguments(null);
    };

    const handleYes = async () => {
        const { newRow, oldRow, reject, resolve } = promiseArguments;
        try {
            await put.putData(`/users/${newRow.id}`, { location: newRow.location });
            resolve(newRow);
            let newData = rowData;
            let index = rowData.findIndex((element: { id: any; }) => element.id === newRow.id);
            if (index >= 0) {
                newData[index].location = newRow.location;
            }
            setData(newData);
            locationCount(newData);
            setSnackbar({ children: 'User successfully saved', severity: 'success' });
            setPromiseArguments(null);
        } catch (error: any) {
            setSnackbar({ children: error?.message, severity: 'error' });
            reject(oldRow);
            setPromiseArguments(null);
        }
    };

    const renderConfirmDialog = () => {
        if (!promiseArguments) {
            return null;
        }

        const { newRow, oldRow } = promiseArguments;
        const mutation = computeMutation(newRow, oldRow);
        return (
            <Dialog
                maxWidth="xs"
                open={true}
            >
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogContent dividers>
                    {`${mutation} Do you want to proceed?`}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleNo}>
                        No
                    </Button>
                    <Button onClick={handleYes}>Yes</Button>
                </DialogActions>
            </Dialog>
        );
    };

    const calcUsersGroupByLoc = (location: any, api: any) => {
        let rowIds = api.getAllRowIds();
        let count = 0;
        rowIds.forEach((row: any) => {
            if (api.getRow(row).location === location) {
                count = count + 1;
            }
        })
        return count;
    }

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'hobby', headerName: 'Hobby', flex: 1 },
        {
            field: 'createdAt', headerName: 'Creation Date', type: 'date', valueFormatter: params =>
                moment(params).format("DD/MM/YYYY hh:mm A"), flex: 1
        },
        {
            field: 'location',
            headerName: 'Location',
            editable: true,
            flex: 1,
            type: 'singleSelect',
            valueOptions: ['ABU DHABI', 'AMSTERDAM', 'AUSTIN', 'BARCELONA', 'BENGALURU', 'BRASILIA', 'BRUSSELS', 'BUENOS AIRES'],
            renderCell: (params: any) => {
                return <Tooltip title={`Total users in '${params.value}' is ${calcUsersGroupByLoc(params.value, params.api)}`}>
                    <span className="table-cell-trucate">{params.value}</span>
                </Tooltip>
            },
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            cellClassName: 'actions',
            getActions: ({ id }) => {

                return [
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "center", height: "90vh" }} >

            {renderConfirmDialog()}
            {fetch.loading ?
                <div><CircularProgress /></div> :
                fetch?.error?.message ?
                    <Alert variant="filled" severity="error">
                        {fetch.error.message}
                    </Alert> :
                    <>{rowData?.length ?
                        <DataGrid
                            rows={rowData}
                            columns={columns}
                            processRowUpdate={processRowUpdate}
                        /> : null}
                        {!!snackbar && (
                            <Snackbar open onClose={handleCloseSnackbar} autoHideDuration={6000}>
                                <Alert {...snackbar} onClose={handleCloseSnackbar} />
                            </Snackbar>
                        )}
                    </>}
        </Box>
    );
}
