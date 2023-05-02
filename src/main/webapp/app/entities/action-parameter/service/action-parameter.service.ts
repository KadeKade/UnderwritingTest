import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IActionParameter, NewActionParameter } from '../action-parameter.model';

export type PartialUpdateActionParameter = Partial<IActionParameter> & Pick<IActionParameter, 'id'>;

export type EntityResponseType = HttpResponse<IActionParameter>;
export type EntityArrayResponseType = HttpResponse<IActionParameter[]>;

@Injectable({ providedIn: 'root' })
export class ActionParameterService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/action-parameters');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(actionParameter: NewActionParameter): Observable<EntityResponseType> {
    return this.http.post<IActionParameter>(this.resourceUrl, actionParameter, { observe: 'response' });
  }

  update(actionParameter: IActionParameter): Observable<EntityResponseType> {
    return this.http.put<IActionParameter>(`${this.resourceUrl}/${this.getActionParameterIdentifier(actionParameter)}`, actionParameter, {
      observe: 'response',
    });
  }

  partialUpdate(actionParameter: PartialUpdateActionParameter): Observable<EntityResponseType> {
    return this.http.patch<IActionParameter>(`${this.resourceUrl}/${this.getActionParameterIdentifier(actionParameter)}`, actionParameter, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IActionParameter>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IActionParameter[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getActionParameterIdentifier(actionParameter: Pick<IActionParameter, 'id'>): number {
    return actionParameter.id;
  }

  compareActionParameter(o1: Pick<IActionParameter, 'id'> | null, o2: Pick<IActionParameter, 'id'> | null): boolean {
    return o1 && o2 ? this.getActionParameterIdentifier(o1) === this.getActionParameterIdentifier(o2) : o1 === o2;
  }

  addActionParameterToCollectionIfMissing<Type extends Pick<IActionParameter, 'id'>>(
    actionParameterCollection: Type[],
    ...actionParametersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const actionParameters: Type[] = actionParametersToCheck.filter(isPresent);
    if (actionParameters.length > 0) {
      const actionParameterCollectionIdentifiers = actionParameterCollection.map(
        actionParameterItem => this.getActionParameterIdentifier(actionParameterItem)!
      );
      const actionParametersToAdd = actionParameters.filter(actionParameterItem => {
        const actionParameterIdentifier = this.getActionParameterIdentifier(actionParameterItem);
        if (actionParameterCollectionIdentifiers.includes(actionParameterIdentifier)) {
          return false;
        }
        actionParameterCollectionIdentifiers.push(actionParameterIdentifier);
        return true;
      });
      return [...actionParametersToAdd, ...actionParameterCollection];
    }
    return actionParameterCollection;
  }
}
