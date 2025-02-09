import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import Link from "@material-ui/core/Link";
import { Table, TableBody, TableCell, TableRow } from "@material-ui/core";
import hexToNumber from "../../helpers/hexToNumber";

const unit = require("ethjs-unit"); //tslint:disable-line

export interface ITxViewProps {
  tx: any;
  receipt: any | null;
}

function renderTxTable(tx: any, receipt: any | null) {
  return (
    <div>
      <div>General</div>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Hash</TableCell>
            <TableCell>{tx.hash}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Block</TableCell>
            <TableCell>
              <Link
                component={({ className, children }: { children: any, className: string }) => (
                  <RouterLink className={className} to={`/block/${tx.blockHash}`} >
                    {children}
                  </RouterLink>
                )}>
                {tx.blockHash}
              </Link>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Block number</TableCell>
            <TableCell>{hexToNumber(tx.blockNumber)}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Gas</TableCell>
            <TableCell>{hexToNumber(tx.gas)}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Gas Price</TableCell>
            <TableCell>{hexToNumber(tx.gasPrice)}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Value</TableCell>
            <TableCell>{unit.fromWei(tx.value, "ether")}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>From</TableCell>
            <TableCell>
              <Link
                component={({ className, children }: { children: any, className: string }) => (
                  <RouterLink className={className} to={`/address/${tx.from}`} >
                    {children}
                  </RouterLink>
                )}>
                {tx.from}
              </Link>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>To</TableCell>
            <TableCell>
              {tx.to !== null ?
                <Link
                  component={({ className, children }: { children: any, className: string }) => (
                    <RouterLink className={className} to={`/address/${tx.to}`} >
                      {children}
                    </RouterLink>
                  )}>
                  {tx.to}
                </Link>
                : null
              }
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Nonce</TableCell>
            <TableCell>{hexToNumber(tx.nonce)}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Transaction Index</TableCell>
            <TableCell>{hexToNumber(tx.transactionIndex)}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Input</TableCell>
            <TableCell>{tx.input}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>v</TableCell>
            <TableCell>{tx.v}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>r</TableCell>
            <TableCell>{tx.r}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>s</TableCell>
            <TableCell>{tx.s}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div>Receipt</div>
      {receipt &&
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Hash</TableCell>
              <TableCell>{receipt.transactionHash}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Block</TableCell>
              <TableCell>
                <Link
                  component={({ className, children }: { children: any, className: string }) => (
                    <RouterLink className={className} to={`/block/${receipt.blockHash}`} >
                      {children}
                    </RouterLink>
                  )}>
                  {receipt.blockHash}
                </Link>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Block number</TableCell>
              <TableCell>{hexToNumber(receipt.blockNumber)}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Gas Used</TableCell>
              <TableCell>{hexToNumber(receipt.gasUsed)}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Cumulative Gas Used</TableCell>
              <TableCell>{hexToNumber(receipt.cumulativeGasUsed)}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Value</TableCell>
              <TableCell>{unit.fromWei(tx.value, "ether")}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>From</TableCell>
              <TableCell>
                <Link
                  component={({ className, children }: { children: any, className: string }) => (
                    <RouterLink className={className} to={`/address/${receipt.from}`} >
                      {children}
                    </RouterLink>
                  )}>
                  {receipt.from}
                </Link>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>To</TableCell>
              <TableCell>
                <Link
                  component={({ className, children }: { children: any, className: string }) => (
                    <RouterLink className={className} to={`/address/${receipt.to}`} >
                      {children}
                    </RouterLink>
                  )}>
                  {receipt.to}
                </Link>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Contract Address</TableCell>
              <TableCell>{receipt.contractAddress}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Transaction Index</TableCell>
              <TableCell>{hexToNumber(receipt.transactionIndex)}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>{receipt.status}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Logs</TableCell>
              <TableCell>
                {receipt.logs.length}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      }
    </div>
  );
}

function TxView(props: ITxViewProps) {
  const { tx, receipt } = props;
  if (!tx) {
    return null;
  }

  return renderTxTable(tx, receipt);
}

export default TxView;
