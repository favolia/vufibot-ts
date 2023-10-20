import { promisify } from 'util';
import { exec as childProcessExec } from 'child_process';

const execute = promisify(childProcessExec);

async function exec(command: string): Promise<string> {
  try {
    const { stdout, stderr } = await execute(command);
    if (stderr) {
      return `exec error: ${stderr}`;
    } else {
      return `exec output:\n\n${stdout}`;
    }
  } catch (error) {
    return `Error: ${error}`;
  }
}

export { exec };
