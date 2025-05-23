// import { createComponentModule, FormCrafterComponentProps, OptionsBuilderOutput } from '@form-crafter/core'
// import { RowsList } from '@form-crafter/generator'
// import { builders } from '@form-crafter/options-builder'
// import { Box, Tab, Tabs as TabsBase } from '@mui/material'
// import { forwardRef, memo, useCallback } from 'react'

// const optionsBuilder = builders.group({
//     activeIndex: builders
//         .select()
//         .label('Активный по умолчанию')
//         .options([
//             {
//                 value: '0',
//                 label: 'Первый',
//             },
//             {
//                 value: '1',
//                 label: 'Второй',
//             },
//             {
//                 value: '2',
//                 label: 'Третий',
//             },
//         ])
//         .required(),
//     menuItems: builders
//         .multifield({
//             index: builders.number().label('Позиция').required(),
//             title: builders.text().label('Название').required(),
//         })
//         .value([
//             {
//                 index: 0,
//                 title: 'Первый',
//             },
//             {
//                 index: 1,
//                 title: 'Второй',
//             },
//             {
//                 index: 2,
//                 title: 'Третий',
//             },
//         ])
//         .label('Меню')
//         .required(),
// })

// type ComponentProps = FormCrafterComponentProps<'container', OptionsBuilderOutput<typeof optionsBuilder>>

// const Tabs = memo(
//     forwardRef<HTMLDivElement, ComponentProps>(({ rows, properties, onChangeProperties }, ref) => {
//         const activeIndex = properties.activeIndex
//         const menuItems = properties.menuItems

//         const handleChange = useCallback(
//             (_, value: string) => {
//                 onChangeProperties({ activeIndex: value })
//             },
//             [onChangeProperties],
//         )

//         return (
//             <Box ref={ref}>
//                 <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
//                     <TabsBase value={activeIndex} onChange={handleChange}>
//                         {menuItems.map(({ title, index }) => (
//                             <Tab key={index} label={title} />
//                         ))}
//                     </TabsBase>
//                 </Box>
//                 {menuItems.map(({ index }) => (
//                     <div key={index} role="tabpanel" hidden={activeIndex !== index}>
//                         {value === index && <Box>{children}</Box>}
//                     </div>
//                 ))}
//             </Box>
//         )
//     }),
// )

// Tabs.displayName = 'Tabs'

// export const tabsModule = createComponentModule({
//     name: 'tabs',
//     label: 'Tabs',
//     type: 'container',
//     optionsBuilder,
//     Component: Tabs,
// })
