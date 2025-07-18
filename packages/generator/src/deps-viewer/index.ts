import { DataSet, Edge, Network, Node, Options } from 'vis-network/standalone'

const nodes = new DataSet<Node>([
    { id: 'input-first-name', label: 'input-first-name' },
    { id: 'input-last-name', label: 'input-last-name' },
    { id: 'date-birth', label: 'date-birth' },
    { id: 'email', label: 'email' },
    { id: 'group-work', label: 'group-work' },
    { id: 'contacts', label: 'contacts' },
    { id: 'date-start', label: 'date-start' },
    { id: 'input-position', label: 'input-position' },
    { id: 'input-salary', label: 'input-salary' },
    { id: 'select-department', label: 'select-department' },
])

const edges = new DataSet<Edge>([
    { from: 'input-first-name', to: 'input-last-name' },
    { from: 'input-first-name', to: 'email' },
    { from: 'input-first-name', to: 'select-department' },
    { from: 'input-salary', to: 'input-last-name' },
    { from: 'input-salary', to: 'select-department' },
    { from: 'date-birth', to: 'email', color: { color: 'red' } },
    { from: 'email', to: 'date-birth', color: { color: 'red' } },
    { from: 'input-last-name', to: 'select-department' },
    { from: 'input-position', to: 'select-department' },
])

const container = document.getElementById('network')
const data = { nodes, edges }
const options: Options = {
    width: '1000px',
    height: '1000px',
    layout: {
        hierarchical: {
            direction: 'UD',
            sortMethod: 'directed',
        },
    },
    edges: {
        arrows: 'to',
    },
}

const show = false

if (show) {
    const network = new Network(container!, data, options)
    console.log('network: ', network)
}
