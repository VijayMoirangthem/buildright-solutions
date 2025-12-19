import { createContext, useContext, useState, ReactNode } from 'react';
import { 
  clients as initialClients, 
  labours as initialLabours, 
  resources as initialResources,
  projects as initialProjects,
  Client,
  Labour,
  Resource,
  Project
} from '@/data/mockData';

interface DataContextType {
  clients: Client[];
  labours: Labour[];
  resources: Resource[];
  projects: Project[];
  addClient: (client: Omit<Client, 'id' | 'dateAdded' | 'financialRecords' | 'resourceUsage'>) => void;
  updateClient: (id: string, data: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addLabour: (labour: Omit<Labour, 'id' | 'dateJoined' | 'attendance' | 'financialRecords'>) => void;
  updateLabour: (id: string, data: Partial<Labour>) => void;
  deleteLabour: (id: string) => void;
  addResource: (resource: Omit<Resource, 'id' | 'used' | 'remaining' | 'startDate' | 'endDate'>) => void;
  updateResource: (id: string, data: Partial<Resource>) => void;
  deleteResource: (id: string) => void;
  addProject: (project: Omit<Project, 'id' | 'image'>) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProjectById: (id: string) => Project | undefined;
  getClientById: (id: string) => Client | undefined;
  getLabourById: (id: string) => Labour | undefined;
  getResourceById: (id: string) => Resource | undefined;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [labours, setLabours] = useState<Labour[]>(initialLabours);
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  // Client CRUD
  const addClient = (data: Omit<Client, 'id' | 'dateAdded' | 'financialRecords' | 'resourceUsage'>) => {
    const newClient: Client = {
      id: String(Date.now()),
      ...data,
      dateAdded: new Date().toISOString().split('T')[0],
      financialRecords: [],
      resourceUsage: [],
    };
    setClients(prev => [newClient, ...prev]);
    
    // Update project if linked
    if (data.projectId) {
      setProjects(prev => prev.map(p => 
        p.id === data.projectId 
          ? { ...p, clientIds: [...p.clientIds, newClient.id] }
          : p
      ));
    }
  };

  const updateClient = (id: string, data: Partial<Client>) => {
    const oldClient = clients.find(c => c.id === id);
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    
    // Update project links
    if (data.projectId !== undefined && oldClient?.projectId !== data.projectId) {
      setProjects(prev => prev.map(p => {
        // Remove from old project
        if (p.id === oldClient?.projectId) {
          return { ...p, clientIds: p.clientIds.filter(cid => cid !== id) };
        }
        // Add to new project
        if (p.id === data.projectId) {
          return { ...p, clientIds: [...p.clientIds, id] };
        }
        return p;
      }));
    }
  };

  const deleteClient = (id: string) => {
    const client = clients.find(c => c.id === id);
    setClients(prev => prev.filter(c => c.id !== id));
    
    // Remove from project
    if (client?.projectId) {
      setProjects(prev => prev.map(p => 
        p.id === client.projectId 
          ? { ...p, clientIds: p.clientIds.filter(cid => cid !== id) }
          : p
      ));
    }
  };

  // Labour CRUD
  const addLabour = (data: Omit<Labour, 'id' | 'dateJoined' | 'attendance' | 'financialRecords'>) => {
    const newLabour: Labour = {
      id: String(Date.now()),
      ...data,
      dateJoined: new Date().toISOString().split('T')[0],
      attendance: [],
      financialRecords: [],
    };
    setLabours(prev => [newLabour, ...prev]);
    
    // Update project if linked
    if (data.projectId) {
      setProjects(prev => prev.map(p => 
        p.id === data.projectId 
          ? { ...p, labourIds: [...p.labourIds, newLabour.id] }
          : p
      ));
    }
  };

  const updateLabour = (id: string, data: Partial<Labour>) => {
    const oldLabour = labours.find(l => l.id === id);
    setLabours(prev => prev.map(l => l.id === id ? { ...l, ...data } : l));
    
    // Update project links
    if (data.projectId !== undefined && oldLabour?.projectId !== data.projectId) {
      setProjects(prev => prev.map(p => {
        // Remove from old project
        if (p.id === oldLabour?.projectId) {
          return { ...p, labourIds: p.labourIds.filter(lid => lid !== id) };
        }
        // Add to new project
        if (p.id === data.projectId) {
          return { ...p, labourIds: [...p.labourIds, id] };
        }
        return p;
      }));
    }
  };

  const deleteLabour = (id: string) => {
    const labour = labours.find(l => l.id === id);
    setLabours(prev => prev.filter(l => l.id !== id));
    
    // Remove from project
    if (labour?.projectId) {
      setProjects(prev => prev.map(p => 
        p.id === labour.projectId 
          ? { ...p, labourIds: p.labourIds.filter(lid => lid !== id) }
          : p
      ));
    }
  };

  // Resource CRUD
  const addResource = (data: Omit<Resource, 'id' | 'used' | 'remaining' | 'startDate' | 'endDate'>) => {
    const newResource: Resource = {
      id: String(Date.now()),
      ...data,
      used: 0,
      remaining: data.quantityPurchased,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };
    setResources(prev => [newResource, ...prev]);
    
    // Update project if linked
    if (data.projectId) {
      setProjects(prev => prev.map(p => 
        p.id === data.projectId 
          ? { ...p, resourceIds: [...p.resourceIds, newResource.id] }
          : p
      ));
    }
  };

  const updateResource = (id: string, data: Partial<Resource>) => {
    const oldResource = resources.find(r => r.id === id);
    setResources(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
    
    // Update project links
    if (data.projectId !== undefined && oldResource?.projectId !== data.projectId) {
      setProjects(prev => prev.map(p => {
        // Remove from old project
        if (p.id === oldResource?.projectId) {
          return { ...p, resourceIds: p.resourceIds.filter(rid => rid !== id) };
        }
        // Add to new project
        if (p.id === data.projectId) {
          return { ...p, resourceIds: [...p.resourceIds, id] };
        }
        return p;
      }));
    }
  };

  const deleteResource = (id: string) => {
    const resource = resources.find(r => r.id === id);
    setResources(prev => prev.filter(r => r.id !== id));
    
    // Remove from project
    if (resource?.projectId) {
      setProjects(prev => prev.map(p => 
        p.id === resource.projectId 
          ? { ...p, resourceIds: p.resourceIds.filter(rid => rid !== id) }
          : p
      ));
    }
  };

  // Project CRUD
  const addProject = (data: Omit<Project, 'id' | 'image'>) => {
    const newProject: Project = {
      id: String(Date.now()),
      ...data,
      image: '/placeholder.svg',
    };
    setProjects(prev => [newProject, ...prev]);
    
    // Update linked entities
    data.clientIds.forEach(cid => {
      setClients(prev => prev.map(c => 
        c.id === cid ? { ...c, projectId: newProject.id } : c
      ));
    });
    data.labourIds.forEach(lid => {
      setLabours(prev => prev.map(l => 
        l.id === lid ? { ...l, projectId: newProject.id } : l
      ));
    });
    data.resourceIds.forEach(rid => {
      setResources(prev => prev.map(r => 
        r.id === rid ? { ...r, projectId: newProject.id } : r
      ));
    });
  };

  const updateProject = (id: string, data: Partial<Project>) => {
    const oldProject = projects.find(p => p.id === id);
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
    
    // Handle client links
    if (data.clientIds && oldProject) {
      const removedClients = oldProject.clientIds.filter(cid => !data.clientIds!.includes(cid));
      const addedClients = data.clientIds.filter(cid => !oldProject.clientIds.includes(cid));
      
      removedClients.forEach(cid => {
        setClients(prev => prev.map(c => 
          c.id === cid ? { ...c, projectId: undefined } : c
        ));
      });
      addedClients.forEach(cid => {
        setClients(prev => prev.map(c => 
          c.id === cid ? { ...c, projectId: id } : c
        ));
      });
    }
    
    // Handle labour links
    if (data.labourIds && oldProject) {
      const removedLabours = oldProject.labourIds.filter(lid => !data.labourIds!.includes(lid));
      const addedLabours = data.labourIds.filter(lid => !oldProject.labourIds.includes(lid));
      
      removedLabours.forEach(lid => {
        setLabours(prev => prev.map(l => 
          l.id === lid ? { ...l, projectId: undefined } : l
        ));
      });
      addedLabours.forEach(lid => {
        setLabours(prev => prev.map(l => 
          l.id === lid ? { ...l, projectId: id } : l
        ));
      });
    }
    
    // Handle resource links
    if (data.resourceIds && oldProject) {
      const removedResources = oldProject.resourceIds.filter(rid => !data.resourceIds!.includes(rid));
      const addedResources = data.resourceIds.filter(rid => !oldProject.resourceIds.includes(rid));
      
      removedResources.forEach(rid => {
        setResources(prev => prev.map(r => 
          r.id === rid ? { ...r, projectId: undefined } : r
        ));
      });
      addedResources.forEach(rid => {
        setResources(prev => prev.map(r => 
          r.id === rid ? { ...r, projectId: id } : r
        ));
      });
    }
  };

  const deleteProject = (id: string) => {
    const project = projects.find(p => p.id === id);
    setProjects(prev => prev.filter(p => p.id !== id));
    
    // Unlink entities
    if (project) {
      project.clientIds.forEach(cid => {
        setClients(prev => prev.map(c => 
          c.id === cid ? { ...c, projectId: undefined } : c
        ));
      });
      project.labourIds.forEach(lid => {
        setLabours(prev => prev.map(l => 
          l.id === lid ? { ...l, projectId: undefined } : l
        ));
      });
      project.resourceIds.forEach(rid => {
        setResources(prev => prev.map(r => 
          r.id === rid ? { ...r, projectId: undefined } : r
        ));
      });
    }
  };

  // Getters
  const getProjectById = (id: string) => projects.find(p => p.id === id);
  const getClientById = (id: string) => clients.find(c => c.id === id);
  const getLabourById = (id: string) => labours.find(l => l.id === id);
  const getResourceById = (id: string) => resources.find(r => r.id === id);

  return (
    <DataContext.Provider value={{
      clients,
      labours,
      resources,
      projects,
      addClient,
      updateClient,
      deleteClient,
      addLabour,
      updateLabour,
      deleteLabour,
      addResource,
      updateResource,
      deleteResource,
      addProject,
      updateProject,
      deleteProject,
      getProjectById,
      getClientById,
      getLabourById,
      getResourceById,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
