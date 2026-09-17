import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ActionItem, ActionStatus } from '../types/project';
import { INITIAL_ACTIONS } from '../data/mockProjects';

interface ActionContextType {
  actions: ActionItem[];
  addAction: (action: Omit<ActionItem, 'id' | 'createdDate'>) => void;
  updateActionStatus: (id: string, status: ActionStatus) => void;
  getActionsByProjectId: (projectId: string) => ActionItem[];
  openCount: number;
  inProgressCount: number;
  completedCount: number;
  overdueCount: number;
}

const ActionContext = createContext<ActionContextType | undefined>(undefined);

export const ActionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [actions, setActions] = useState<ActionItem[]>(() => {
    const saved = localStorage.getItem('sanket_actions_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved actions', e);
      }
    }
    return INITIAL_ACTIONS;
  });

  useEffect(() => {
    localStorage.setItem('sanket_actions_v1', JSON.stringify(actions));
  }, [actions]);

  const addAction = (newActionData: Omit<ActionItem, 'id' | 'createdDate'>) => {
    const randomSuffix = Math.floor(10 + Math.random() * 90);
    const newId = `ACT-2025-0${randomSuffix}`;
    const today = new Date().toISOString().split('T')[0];

    const newAction: ActionItem = {
      ...newActionData,
      id: newId,
      createdDate: today,
      completedDate: newActionData.status === 'Completed' ? today : undefined
    };

    setActions(prev => [newAction, ...prev]);
  };

  const updateActionStatus = (id: string, status: ActionStatus) => {
    const today = new Date().toISOString().split('T')[0];
    setActions(prev =>
      prev.map(act => {
        if (act.id === id) {
          return {
            ...act,
            status,
            completedDate: status === 'Completed' ? today : act.completedDate
          };
        }
        return act;
      })
    );
  };

  const getActionsByProjectId = (projectId: string) => {
    return actions.filter(act => act.projectId === projectId);
  };

  const openCount = actions.filter(a => a.status === 'Open').length;
  const inProgressCount = actions.filter(a => a.status === 'In Progress').length;
  const completedCount = actions.filter(a => a.status === 'Completed').length;
  const overdueCount = actions.filter(a => a.status === 'Overdue').length;

  return (
    <ActionContext.Provider
      value={{
        actions,
        addAction,
        updateActionStatus,
        getActionsByProjectId,
        openCount,
        inProgressCount,
        completedCount,
        overdueCount
      }}
    >
      {children}
    </ActionContext.Provider>
  );
};

export const useActions = (): ActionContextType => {
  const context = useContext(ActionContext);
  if (!context) {
    throw new Error('useActions must be used within an ActionProvider');
  }
  return context;
};
