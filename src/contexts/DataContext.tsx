import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  projects as initialProjects, 
  clients as initialClients, 
  labours as initialLabours, 
  resources as initialResources,
  Project,
  Client,
  Labour,
  Resource
} from '@/data/mockData';

interface DataContextType {
  projects: Project[];
  clients: Client[];
  labours: Labour[];
  resources: Resource[];
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addClient: (client: Omit<Client, 'id' | 'dateAdded' | 'financialRecords' | 'resourceUsage'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addLabour: (labour: Omit<Labour, 'id' | 'dateJoined' | 'attendance' | 'financialRecords'>) => void;
  updateLabour: (id: string, labour: Partial<Labour>) => void;
  deleteLabour: (id: string) => void;
  addResource: (resource: Omit<Resource, 'id' | 'remaining' | 'startDate' | 'endDate' | 'used'>) => void;
  updateResource: (id: string, resource: Partial<Resource>) => void;
  deleteResource: (id: string) => void;
  linkClientToProject: (clientId: string, projectId: string) => void;
  linkLabourToProject: (labourId: string, projectId: string) => void;
  linkResourceToProject: (resourceId: string, projectId: string) => void;
  unlinkClientFromProject: (clientId: string, projectId: string) => void;
  unlinkLabourFromProject: (labourId: string, projectId: string) => void;
  unlinkResourceFromProject: (resourceId: string, projectId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [labours, setLabours] = useState<Labour[]>(initialLabours);
  const [resources, setResources] = useState<Resource[]>(initialResources);

  // Project CRUD
  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...project,
      id: String(Date.now()),
    };
    setProjects(prev => [...prev, newProject]);
  };

  const updateProject = (id: string, updatedProject: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updatedProject } : p));
  };

  const deleteProject = (id: string) => {
    // Remove project
    setProjects(prev => prev.filter(p => p.id !== id));
    
    // Unlink clients
    setClients(prev => prev.map(c => 
      c.projectId === id ? { ...c, projectId: undefined } : c
    ));
    
    // Unlink labours
    setLabours(prev => prev.map(l => 
      l.projectId === id ? { ...l, projectId: undefined } : l
    ));
    
    // Unlink resources
    setResources(prev => prev.map(r => 
      r.projectId === id ? { ...r, projectId: undefined } : r
    ));
  };

  // Client CRUD
  const addClient = (client: Omit<Client, 'id' | 'dateAdded' | 'financialRecords' | 'resourceUsage'>) => {
    const newClient: Client = {
      ...client,
      id: String(Date.now()),
      dateAdded: new Date().toISOString().split('T')[0],
      financialRecords: [],
      resourceUsage: [],
    };
    setClients(prev => [...prev, newClient]);
    
    // If client has a projectId, sync with project
    if (newClient.projectId) {
      setProjects(prev => prev.map(p => 
        p.id === newClient.projectId 
          ? { ...p, clientIds: [...p.clientIds, newClient.id] }
          : p
      ));
    }
  };

  const updateClient = (id: string, updatedClient: Partial<Client>) => {
    const oldClient = clients.find(c => c.id === id);
    const oldProjectId = oldClient?.projectId;
    const newProjectId = updatedClient.projectId;
    
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...updatedClient } : c));
    
    // Handle project linking changes
    if (oldProjectId !== newProjectId) {
      // Remove from old project
      if (oldProjectId) {
        setProjects(prev => prev.map(p => 
          p.id === oldProjectId 
            ? { ...p, clientIds: p.clientIds.filter(cId => cId !== id) }
            : p
        ));
      }
      
      // Add to new project
      if (newProjectId) {
        setProjects(prev => prev.map(p => 
          p.id === newProjectId 
            ? { ...p, clientIds: [...p.clientIds, id] }
            : p
        ));
      }
    }
  };

  const deleteClient = (id: string) => {
    const client = clients.find(c => c.id === id);
    
    setClients(prev => prev.filter(c => c.id !== id));
    
    // Remove from associated project
    if (client?.projectId) {
      setProjects(prev => prev.map(p => 
        p.id === client.projectId 
          ? { ...p, clientIds: p.clientIds.filter(cId => cId !== id) }
          : p
      ));
    }
  };

  // Labour CRUD
  const addLabour = (labour: Omit<Labour, 'id' | 'dateJoined' | 'attendance' | 'financialRecords'>) => {
    const newLabour: Labour = {
      ...labour,
      id: String(Date.now()),
      dateJoined: new Date().toISOString().split('T')[0],
      attendance: [],
      financialRecords: [],
    };
    setLabours(prev => [...prev, newLabour]);
    
    // If labour has a projectId, sync with project
    if (newLabour.projectId) {
      setProjects(prev => prev.map(p => 
        p.id === newLabour.projectId 
          ? { ...p, labourIds: [...p.labourIds, newLabour.id] }
          : p
      ));
    }
  };

  const updateLabour = (id: string, updatedLabour: Partial<Labour>) => {
    const oldLabour = labours.find(l => l.id === id);
    const oldProjectId = oldLabour?.projectId;
    const newProjectId = updatedLabour.projectId;
    
    setLabours(prev => prev.map(l => l.id === id ? { ...l, ...updatedLabour } : l));
    
    // Handle project linking changes
    if (oldProjectId !== newProjectId) {
      // Remove from old project
      if (oldProjectId) {
        setProjects(prev => prev.map(p => 
          p.id === oldProjectId 
            ? { ...p, labourIds: p.labourIds.filter(lId => lId !== id) }
            : p
        ));
      }
      
      // Add to new project
      if (newProjectId) {
        setProjects(prev => prev.map(p => 
          p.id === newProjectId 
            ? { ...p, labourIds: [...p.labourIds, id] }
            : p
        ));
      }
    }
  };

  const deleteLabour = (id: string) => {
    const labour = labours.find(l => l.id === id);
    
    setLabours(prev => prev.filter(l => l.id !== id));
    
    // Remove from associated project
    if (labour?.projectId) {
      setProjects(prev => prev.map(p => 
        p.id === labour.projectId 
          ? { ...p, labourIds: p.labourIds.filter(lId => lId !== id) }
          : p
      ));
    }
  };

  // Resource CRUD
  const addResource = (resource: Omit<Resource, 'id' | 'remaining' | 'used'>) => {
    const newResource: Resource = {
      ...resource,
      id: String(Date.now()),
      used: 0,
      remaining: resource.quantityPurchased,
      unit: resource.unit || 'Bags',
      purchaseDate: resource.purchaseDate || new Date().toISOString().split('T')[0],
    };
    setResources(prev => [...prev, newResource]);
    
    // If resource has a projectId, sync with project
    if (newResource.projectId) {
      setProjects(prev => prev.map(p => 
        p.id === newResource.projectId 
          ? { ...p, resourceIds: [...p.resourceIds, newResource.id] }
          : p
      ));
    }
  };

  const updateResource = (id: string, updatedResource: Partial<Resource>) => {
    const oldResource = resources.find(r => r.id === id);
    const oldProjectId = oldResource?.projectId;
    const newProjectId = updatedResource.projectId;
    
    setResources(prev => prev.map(r => r.id === id ? { ...r, ...updatedResource } : r));
    
    // Handle project linking changes
    if (oldProjectId !== newProjectId) {
      // Remove from old project
      if (oldProjectId) {
        setProjects(prev => prev.map(p => 
          p.id === oldProjectId 
            ? { ...p, resourceIds: p.resourceIds.filter(rId => rId !== id) }
            : p
        ));
      }
      
      // Add to new project
      if (newProjectId) {
        setProjects(prev => prev.map(p => 
          p.id === newProjectId 
            ? { ...p, resourceIds: [...p.resourceIds, id] }
            : p
        ));
      }
    }
  };

  const deleteResource = (id: string) => {
    const resource = resources.find(r => r.id === id);
    
    setResources(prev => prev.filter(r => r.id !== id));
    
    // Remove from associated project
    if (resource?.projectId) {
      setProjects(prev => prev.map(p => 
        p.id === resource.projectId 
          ? { ...p, resourceIds: p.resourceIds.filter(rId => rId !== id) }
          : p
      ));
    }
  };

  // Linking functions
  const linkClientToProject = (clientId: string, projectId: string) => {
    setClients(prev => prev.map(c => 
      c.id === clientId ? { ...c, projectId } : c
    ));
    setProjects(prev => prev.map(p => 
      p.id === projectId && !p.clientIds.includes(clientId)
        ? { ...p, clientIds: [...p.clientIds, clientId] }
        : p
    ));
  };

  const linkLabourToProject = (labourId: string, projectId: string) => {
    setLabours(prev => prev.map(l => 
      l.id === labourId ? { ...l, projectId } : l
    ));
    setProjects(prev => prev.map(p => 
      p.id === projectId && !p.labourIds.includes(labourId)
        ? { ...p, labourIds: [...p.labourIds, labourId] }
        : p
    ));
  };

  const linkResourceToProject = (resourceId: string, projectId: string) => {
    setResources(prev => prev.map(r => 
      r.id === resourceId ? { ...r, projectId } : r
    ));
    setProjects(prev => prev.map(p => 
      p.id === projectId && !p.resourceIds.includes(resourceId)
        ? { ...p, resourceIds: [...p.resourceIds, resourceId] }
        : p
    ));
  };

  const unlinkClientFromProject = (clientId: string, projectId: string) => {
    setClients(prev => prev.map(c => 
      c.id === clientId ? { ...c, projectId: undefined } : c
    ));
    setProjects(prev => prev.map(p => 
      p.id === projectId 
        ? { ...p, clientIds: p.clientIds.filter(id => id !== clientId) }
        : p
    ));
  };

  const unlinkLabourFromProject = (labourId: string, projectId: string) => {
    setLabours(prev => prev.map(l => 
      l.id === labourId ? { ...l, projectId: undefined } : l
    ));
    setProjects(prev => prev.map(p => 
      p.id === projectId 
        ? { ...p, labourIds: p.labourIds.filter(id => id !== labourId) }
        : p
    ));
  };

  const unlinkResourceFromProject = (resourceId: string, projectId: string) => {
    setResources(prev => prev.map(r => 
      r.id === resourceId ? { ...r, projectId: undefined } : r
    ));
    setProjects(prev => prev.map(p => 
      p.id === projectId 
        ? { ...p, resourceIds: p.resourceIds.filter(id => id !== resourceId) }
        : p
    ));
  };

  return (
    <DataContext.Provider
      value={{
        projects,
        clients,
        labours,
        resources,
        addProject,
        updateProject,
        deleteProject,
        addClient,
        updateClient,
        deleteClient,
        addLabour,
        updateLabour,
        deleteLabour,
        addResource,
        updateResource,
        deleteResource,
        linkClientToProject,
        linkLabourToProject,
        linkResourceToProject,
        unlinkClientFromProject,
        unlinkLabourFromProject,
        unlinkResourceFromProject,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}