import { EventEmitter } from 'events';

type TaskState = 'Pendiente' | 'En progreso' | 'Completada';

interface Task {
    id: number;
    description: string; 
    status: TaskState; 
    dueDate: Date;       
}

interface Proyect {
    id: number;
    name: string;        
    startDate: Date;     
    tasks: Task[];      
}

const projectsDB: Proyect[] = [
    {
        id: 101,
        name: "ProjectPulse",
        startDate: new Date('2024-11-01'),
        tasks: [
            {
                id: 1,
                description: "Configurar repositorio",
                status: "Completada",
                dueDate: new Date('2024-11-05'),
            },
            {
                id: 2,
                description: "Diseñar esquema de base de datos",
                status: "En progreso",
                dueDate: new Date('2024-11-20'),
            },
            {
                id: 3,
                description: "Implementar autenticación",
                status: "Pendiente",
                dueDate: new Date('2024-11-25'),
            },
        ],
    },
];

// EJERCICIO 1: Gestión de Proyectos y Tareas

// Añadir nuevas tareas
function addTask(project: Proyect, newTask: Task): void {
    project.tasks.push(newTask);
}

// Generar resumen del proyecto
function generateSummary(project: Proyect): { [key in TaskState]: number } {
    return project.tasks.reduce(
        (summary, task) => {
            summary[task.status]++;
            return summary;
        },
        { 'Pendiente': 0, 'En progreso': 0, 'Completada': 0 }
    );
}

// Ordenar tareas por fecha límite
function sortTasksByDueDate(project: Proyect): Task[] {
    return [...project.tasks].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
}

console.log("EJERCICIO 1 - Gestión de Proyectos y Tareas");

console.log("Punto 1: Añadir nuevas tareas");

console.log("Tareas Antes de añadir una nueva:", projectsDB[0].tasks);

addTask(projectsDB[0], {
    id: 4,
    description: "Crear documentación",
    status: "Pendiente",
    dueDate: new Date('2024-11-01'),
});
console.log("Tareas después de añadir una nueva:", projectsDB[0].tasks);

console.log("\nPunto 2: Generar un resumen del proyecto");
const summary = generateSummary(projectsDB[0]);
console.log("Resumen del proyecto:", summary);

console.log("\nPunto 3: Ordenar tareas por fecha límite");
const sortedTasks = sortTasksByDueDate(projectsDB[0]);
console.log("Tareas ordenadas por fecha límite:", sortedTasks);

// EJERCICIO 2: Análisis Avanzado de Tareas

// Filtrar tareas
function filterProjectTasks(project: Proyect, filter: (task: Task) => boolean): Task[] {
    return project.tasks.filter(filter);
}

// Calcular tiempo restante
function calculateRemainingTime(project: Proyect): number {
    return project.tasks
        .filter(task => task.status !== 'Completada')
        .reduce((days, task) => {
            const remainingTime = (task.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
            return days + Math.max(0, Math.ceil(remainingTime));
        }, 0);
}

// Obtener tareas críticas
function getCriticalTasks(project: Proyect): Task[] {
    return project.tasks.filter(task => {
        const daysLeft = (task.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
        return daysLeft < 3 && task.status !== 'Completada';
    });
}

console.log("\nEJERCICIO 2 - Análisis Avanzado de Tareas");

console.log("Punto 1: Filtrar tareas pendientes");
const pendingTasks = filterProjectTasks(projectsDB[0], task => task.status === "Pendiente");
console.log("Tareas pendientes:", pendingTasks);

console.log("\nPunto 2: Calcular tiempo restante para tareas pendientes");
const remainingTime = calculateRemainingTime(projectsDB[0]);
console.log("Tiempo restante para tareas pendientes:", remainingTime, "días");

console.log("\nPunto 3: Obtener tareas críticas");
const criticalTasks = getCriticalTasks(projectsDB[0]);
console.log("Tareas críticas (menos de 3 días restantes):", criticalTasks);

// EJERCICIO 3: Sincronización y Actualizaciones

// Cargar detalles del proyecto
async function loadProjectDetail(id: number): Promise<Proyect> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const project = projectsDB.find(p => p.id === id);
            if (project) {
                resolve(project);
            } else {
                reject(new Error('Proyecto no encontrado'));
            }
        }, 2000);
    });
}

// Actualizar estado de una tarea
async function updateTaskStatus(project: Proyect, taskId: number, newStatus: TaskState): Promise<void> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const task = project.tasks.find(t => t.id === taskId);
            if (task) {
                task.status = newStatus;
                resolve();
            } else {
                reject(new Error("Tarea no encontrada"));
            }
        }, 1000);
    });
}

// Sistema de notificaciones utilizando EventEmitter
const taskNotifier = new EventEmitter();

// Suscribir eventos
taskNotifier.on('taskCompleted', (taskId: number) => {
    console.log(`Notificación: ¡La tarea con ID ${taskId} ha sido completada!`);
});

console.log("\nEJERCICIO 3 - Sincronización y Actualizaciones");

(async () => {
    try {
        console.log("Punto 1: Cargar detalles del proyecto");
        let project = await loadProjectDetail(101);
        console.log("Proyecto cargado:", project);

        console.log("\nPunto 2: Actualizar el estado de una tarea");
        await updateTaskStatus(project, 2, "Completada");
        console.log("Estado de la tarea actualizado con éxito.");

        taskNotifier.emit('taskCompleted', 2);

        console.log("\nPunto 3: Cargar nuevamente el proyecto para verificar la actualización");
        project = await loadProjectDetail(101);
        console.log("Proyecto actualizado:", project);
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error:", error.message);
        } else {
            console.error("Error desconocido:", error);
        }
    }
})();
