import { genId } from '@/lib/id';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useTool } from '@/hooks';
import { Icons } from '@/components/icons';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../ui/table';

const VariableRow = ({ variable, onDelete, showActions, onUpdate }: any) => {
  const [name, setName] = useState(variable.name ?? '');
  const [description, setDescription] = useState(variable.description ?? '');
  const [isDeleting, setIsDeleting] = useState(false);
  useEffect(() => {
    setName(variable.name ?? '');
    setDescription(variable.description ?? '');
  }, [variable?.name, variable?.description]);

  const handleBlur = (field: string, value: string) => {
    if (variable.id) {
      onUpdate(variable, field, value);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(variable);
    } catch (e) {
      console.error('Failed to delete variable:', e);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <TableRow className="group flex items-center gap-1 w-full">
      <TableCell className="w-48">
        <Input
          value={name}
          placeholder={'VAR_NAME'}
          onChange={(e) => setName(e.target.value)}
          onBlur={(e) => handleBlur('name', e.target.value)}
          className="input input-sm input-bordered bg-transparent rounded w-full"
        />
      </TableCell>
      <TableCell className="flex-grow">
        <Input
          value={description}
          placeholder="Variable description"
          onChange={(e) => setDescription(e.target.value)}
          onBlur={(e) => handleBlur('description', e.target.value)}
          className="input input-sm input-bordered bg-transparent rounded w-full"
        />
      </TableCell>
      <TableCell className="w-16 flex justify-center">
        {showActions && (
          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7"
            onClick={handleDelete}
          >
            {isDeleting ? (
              <Icons.spinner className="w-4 h-4 animate-spin text-red-500" />
            ) : (
              <Icons.trash className="w-4 h-4 text-red-500" />
            )}
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};

const VariableList = ({ toolId, className, ...props }: any) => {
  const { tool, updateTool } = useTool(toolId);
  const [newVariable, setNewVariable] = useState({
    id: genId(),
    name: '',
    description: '',
    default_value: '',
  });

  const handleDelete = async (variable: any) => {
    if (!tool) return;
    await updateTool({
      variables: tool.variables.filter((v: any) => v.id !== variable.id),
    });
  };

  const handleUpdate = (variable: any, name: string, value: any) => {
    if (!variable) return;
    if (!tool) return;
    console.log('handleUpdate', variable, newVariable, name, value);
    if (variable.id === newVariable.id) {
      if (!name) return;
      // If the variable is the new variable, add it to the list
      const updatedVariable = { ...variable, [name]: value };
      setNewVariable({
        id: genId(),
        name: '',
        description: '',
        default_value: '',
      });
      updateTool({
        variables: [...tool.variables, updatedVariable],
      });
    } else {
      // Update existing variable
      updateTool({
        variables: tool.variables.map((v: any) =>
          v.id === variable.id ? { ...v, [name]: value } : v
        ),
      });
    }
  };

  return (
    <Card
      className={clsx(
        'flex flex-col gap-1 overflow-x-auto p-2 border border-base-content/20',
        className
      )}
    >
      <div className="text-lg font-bold">Variables</div>
      <div className="text-sm">
        Variables are used to pass data between tools.
      </div>
      <Table className="table table-xs border-transparent">
        <TableHeader>
          <TableRow className="flex items-center gap-1 w-full">
            <TableCell className="w-48">Variable name</TableCell>
            <TableCell className="flex-grow">Variable description</TableCell>
            <TableCell className="w-16 text-right">Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tool?.variables?.map((variable: any, index: number) => (
            <VariableRow
              key={variable.id}
              variable={variable}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              showActions
            />
          ))}
          <VariableRow
            key={newVariable.id}
            variable={newVariable}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        </TableBody>
      </Table>
    </Card>
  );
};

export default VariableList;
