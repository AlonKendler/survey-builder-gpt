import { Card, CardContent, Divider, List, ListItem, ListItemText, ListSubheader, Typography } from '@mui/material';
import React from 'react'

interface RowListProps {
    list: {
        name: string;
        value: number;
    }[];
    label: string;
    title: string;
    // index: number
}

const RowList: React.FC<RowListProps> = ({ list, label, title }) => {
    return (
        <Card sx={{ marginTop: 2 }}>
            <CardContent>
                <Typography>{title}</Typography>
                <List
                    sx={{
                        bgcolor: "background.paper",
                        position: "relative",
                        overflow: "auto",
                        maxHeight: 400,
                    }}
                >

                    {list && list?.map((value: any, index: number) => {
                        const labelId = `checkbox-list-label-${value}`;
                        return (
                            <ListItem
                                key={value.name + index}
                                disablePadding
                                sx={{
                                    bgcolor: "#f8f9fa",
                                    borderRadius: "4px",
                                    marginTop: 1,
                                    padding: 1,
                                }}
                            >
                                <ListItemText id={labelId} primary={`${value.name}`} />
                            </ListItem>
                        );
                    })}
                </List>
            </CardContent>
        </Card>
    )
}

export default RowList