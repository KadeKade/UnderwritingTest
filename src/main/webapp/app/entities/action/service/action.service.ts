import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAction, NewAction } from '../action.model';

export type PartialUpdateAction = Partial<IAction> & Pick<IAction, 'id'>;

export type EntityResponseType = HttpResponse<IAction>;
export type EntityArrayResponseType = HttpResponse<IAction[]>;

@Injectable({ providedIn: 'root' })
export class ActionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/actions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(action: NewAction): Observable<EntityResponseType> {
    return this.http.post<IAction>(this.resourceUrl, action, { observe: 'response' });
  }

  update(action: IAction): Observable<EntityResponseType> {
    return this.http.put<IAction>(`${this.resourceUrl}/${this.getActionIdentifier(action)}`, action, { observe: 'response' });
  }

  partialUpdate(action: PartialUpdateAction): Observable<EntityResponseType> {
    return this.http.patch<IAction>(`${this.resourceUrl}/${this.getActionIdentifier(action)}`, action, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAction>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAction[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getActionIdentifier(action: Pick<IAction, 'id'>): number {
    return action.id;
  }

  compareAction(o1: Pick<IAction, 'id'> | null, o2: Pick<IAction, 'id'> | null): boolean {
    return o1 && o2 ? this.getActionIdentifier(o1) === this.getActionIdentifier(o2) : o1 === o2;
  }

  addActionToCollectionIfMissing<Type extends Pick<IAction, 'id'>>(
    actionCollection: Type[],
    ...actionsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const actions: Type[] = actionsToCheck.filter(isPresent);
    if (actions.length > 0) {
      const actionCollectionIdentifiers = actionCollection.map(actionItem => this.getActionIdentifier(actionItem)!);
      const actionsToAdd = actions.filter(actionItem => {
        const actionIdentifier = this.getActionIdentifier(actionItem);
        if (actionCollectionIdentifiers.includes(actionIdentifier)) {
          return false;
        }
        actionCollectionIdentifiers.push(actionIdentifier);
        return true;
      });
      return [...actionsToAdd, ...actionCollection];
    }
    return actionCollection;
  }
}
