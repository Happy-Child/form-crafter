import { FC, memo, useState } from 'react'

import { TabContext, TabPanel } from '@mui/lab'
import { Tab, Tabs } from '@mui/material'

import { MutationsDepsChart } from '../MutationsDepsChart'
import { ButtonStyled, Root } from './styles'

const DepsViewerBase: FC = () => {
    const [tab, setTab] = useState('one')
    const [open, setOpen] = useState(false)

    return (
        <Root>
            <ButtonStyled variant="contained" onClick={() => setOpen((prev) => !prev)}>
                Toggle
            </ButtonStyled>
            {open && (
                <TabContext value={tab}>
                    <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)} textColor="secondary" indicatorColor="secondary">
                        <Tab value="one" label="Граф завис. для разрешения мутаций" />
                        <Tab value="two" label="Валидации..." />
                        <Tab value="three" label="Вью..." />
                    </Tabs>
                    <TabPanel value="one">
                        <MutationsDepsChart />
                    </TabPanel>
                    <TabPanel value="two">Валидации...</TabPanel>
                    <TabPanel value="three">Вью..</TabPanel>
                </TabContext>
            )}
        </Root>
    )
}

export const DepsViewer = memo(DepsViewerBase)
