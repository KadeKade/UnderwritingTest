import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAutomatedAction, NewAutomatedAction } from '../automated-action.model';

export type PartialUpdateAutomatedAction = Partial<IAutomatedAction> & Pick<IAutomatedAction, 'id'>;

export type EntityResponseType = HttpResponse<IAutomatedAction>;
export type EntityArrayResponseType = HttpResponse<IAutomatedAction[]>;

@Injectable({ providedIn: 'root' })
export class AutomatedActionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/automated-actions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(automatedAction: NewAutomatedAction): Observable<EntityResponseType> {
    return this.http.post<IAutomatedAction>(this.resourceUrl, automatedAction, { observe: 'response' });
  }

  update(automatedAction: IAutomatedAction): Observable<EntityResponseType> {
    return this.http.put<IAutomatedAction>(`${this.resourceUrl}/${this.getAutomatedActionIdentifier(automatedAction)}`, automatedAction, {
      observe: 'response',
    });
  }

  partialUpdate(automatedAction: PartialUpdateAutomatedAction): Observable<EntityResponseType> {
    return this.http.patch<IAutomatedAction>(`${this.resourceUrl}/${this.getAutomatedActionIdentifier(automatedAction)}`, automatedAction, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAutomatedAction>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAutomatedAction[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAutomatedActionIdentifier(automatedAction: Pick<IAutomatedAction, 'id'>): number {
    return automatedAction.id;
  }

  compareAutomatedAction(o1: Pick<IAutomatedAction, 'id'> | null, o2: Pick<IAutomatedAction, 'id'> | null): boolean {
    return o1 && o2 ? this.getAutomatedActionIdentifier(o1) === this.getAutomatedActionIdentifier(o2) : o1 === o2;
  }

  addAutomatedActionToCollectionIfMissing<Type extends Pick<IAutomatedAction, 'id'>>(
    automatedActionCollection: Type[],
    ...automatedActionsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const automatedActions: Type[] = automatedActionsToCheck.filter(isPresent);
    if (automatedActions.length > 0) {
      const automatedActionCollectionIdentifiers = automatedActionCollection.map(
        automatedActionItem => this.getAutomatedActionIdentifier(automatedActionItem)!
      );
      const automatedActionsToAdd = automatedActions.filter(automatedActionItem => {
        const automatedActionIdentifier = this.getAutomatedActionIdentifier(automatedActionItem);
        if (automatedActionCollectionIdentifiers.includes(automatedActionIdentifier)) {
          return false;
        }
        automatedActionCollectionIdentifiers.push(automatedActionIdentifier);
        return true;
      });
      return [...automatedActionsToAdd, ...automatedActionCollection];
    }
    return automatedActionCollection;
  }
}
